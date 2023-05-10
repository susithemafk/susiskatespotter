
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react" 
import { db } from "../firebase" 
import { ref, onValue } from "firebase/database" 
import Button from "../components/Button"
import Select from 'react-select' 
import { set } from "firebase/database" 
import { storage } from "../firebase"
import { ref as storageRef, deleteObject, getDownloadURL, uploadBytes } from "firebase/storage"
import imageCompression from "browser-image-compression"
import styles from './EditPlace.module.scss'
import { Link } from "react-router-dom"


const EditPlace = () => {

    const { placeID } = useParams()
    const [place, setPlace] = useState({})
    const [loading, setLoading] = useState(false) 
    const [submitted, setSubmitted] = useState(false)
    const [category, setCategory] = useState()

    const [imagesToUpload, setImagesToUpload] = useState([undefined, undefined, undefined]) 

    const [deletedImages, setDeletedImages] = useState([]) // array of urls of images to be deleted from storage

    const [spotLink, setSpotLink] = useState('') // link to spot after editing

    // useEffect(() => console.log(place), [place]) 
    /**
     * get all places
     */
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            // gets all data from database
            const data = snapshot.val()
            const allPlaces = Object.values(Object.assign(data.skateparks, data.spots)) // join skateparks and spots 

            allPlaces.map(place => {
                if (place.uuid === placeID) {
                    setPlace(place)
                }
            })

        })
    }, [placeID]) 

    const handleChange = (e) => {
        const { name, value } = e.target 

        if (name === 'lat' || name === 'lng') {
            setPlace(prevState => ({ ...prevState, [name]: Number(value) })) 
        } else {
            setPlace(prevState => ({ ...prevState, [name]: value })) 
        }

        setSubmitted(false)
    } 

    /**
     * begins the whole process of uploading data to database and storage
     */
    const handleSubmit = (e) => {
        e.preventDefault()
        writeToDatabase() 

        // delete images that were deleted from the place
        deletedImages?.map(image => {
            if (image) {
                const match = image.match(/\/o\/(.+)\?alt=/)
                const path = match ? decodeURIComponent(match[1]) : null
                
                if (path) {
                    const fileRef = storageRef(storage, path)
                    deleteObject(fileRef)
                    .then(() => {
                        console.log('deleted from storage') 
                    })
                    .catch((error) => {
                        console.log('error deleting from storage') 
                        console.log(error)
                    })
                }
            }
        })
    }  

    useEffect(() => {
        // console.log(deletedImages)
        // console.log(imagesToUpload) 
        // console.log(place)
    }, [deletedImages, place, imagesToUpload])

    // delete image on X button click
    const deleteImage = (index) => {

        if (place.images.length > 1) {  
            if (place.images[index] ? place.images[index].slice(0,4) !== 'blob' : '') setDeletedImages(prevState => [...prevState, place.images[index]]) 
            setPlace(prevState => ({ ...prevState, images: place.images.filter((image, i) => i !== index) }))  

            let files = imagesToUpload
            if (index == 0) files = [files[1], files[2], undefined]
            if (index == 1) files = [files[0], files[2], undefined]
            if (index == 2) files = [files[0], files[1], undefined]
            setImagesToUpload(files) 
        }
        else {
            alert('nemůžeš odebrat všechny obrázky')
        } 
    }

    // images input 
    const handleImageInputs = async (e) => {
        const urls = place.images
        const temp = await compressImage(e.target.files[0]) 

        // sets images to be deleted 
        const filesToDelete = []
        if (e.target.name === "image0") if (place.images[0] ? place.images[0].slice(0,4) !== 'blob' : '') filesToDelete.push(place.images[0])
        if (e.target.name === "image1") if (place.images[1] ? place.images[1].slice(0,4) !== 'blob' : '') filesToDelete.push(place.images[1])
        if (e.target.name === "image2") if (place.images[2] ? place.images[2].slice(0,4) !== 'blob' : '') filesToDelete.push(place.images[2])
        setDeletedImages([...deletedImages, ...filesToDelete])

        // sets preview images
        if (e.target.name === "image0") urls[0] = URL.createObjectURL(temp)
        if (e.target.name === "image1") urls[1] = URL.createObjectURL(temp)
        if (e.target.name === "image2") urls[2] = URL.createObjectURL(temp)
        setPlace(prevState => ({ ...prevState, images: urls })) // prints images to screen 
                
        // sets images to be uploaded
        let files = imagesToUpload 
        if (e.target.name === "image0") files[0] = temp
        if (e.target.name === "image1") files[1] = temp
        if (e.target.name === "image2") files[2] = temp
        setImagesToUpload(files) 
    }

    /**
     * use browser-image-compression to compress images
     */
    const compressImage = async (image) => {
        let compressedImage 

        const newFileName = `${Date.now()}-${image.name}`;
        const tempImage = new File([image], newFileName, { type: image.type })
        // const tempImage = image

        const compressionOptions = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800, 
        }
        try {
            compressedImage = await imageCompression(tempImage, compressionOptions)
        } catch (error) {
            console.log('error compressing images')
            console.log(error)
        }
        return compressedImage
    }

    // uploads images to firebase storage and returns an array of urls
    const handleFileUpload = async () => {
        console.log('writing to database - handling file upload')

        let newArrayOfFilesAndURLs = place.images // smth like ['url', File{}, 'url']
        // that will then be sent below in this function and if it is a file
        // then upload and get its url, old urls stay as they are
        imagesToUpload.map((image, index) => {
            if (image) newArrayOfFilesAndURLs[index] = image
        })

        let urls = place.images
      
        if (place.images.length > 0) {

            const uploadPromises = imagesToUpload.map((image, index) => {
                if (image instanceof Blob) {
                    const imageRef = storageRef(storage, `/images/${image.name}`)
                    const uploadTask = uploadBytes(imageRef, image)
            
                    return uploadTask.then((snapshot) => {
                        console.log('Upload successful')
                
                        return getDownloadURL(snapshot.ref)
                            .then((downloadURL) => {
                            urls[index] = downloadURL
                            })
                            .catch((err) => {
                            console.log('Error:', err)
                            })
                        })
                        .catch((error) => {
                        console.log('Error:', error)
                    })
                }
            })
            await Promise.all(uploadPromises) // Wait for all the upload Promises to complete
        }
      
        return urls
      }
      
      

    // updates uuid and images and sends impulse to useEffect
    const [databaseDataSet, setDatabaseDataSet] = useState(false)
    const writeToDatabase = async () => {
        console.log('writing to database - start')
        setLoading(true)

        const urls = await handleFileUpload()
        // console.log(urls)

        setPlace(prevState => ({ ...prevState, images: urls }))
        setPlace(prevState => ({ ...prevState, lasteditdate: Date.now() })) 
        // setPlace(prevState => ({ ...prevState, category: category.value }))

        const tempSpotLink = place.category === 'skatepark' ? `/skateparks/${place.uuid}` : `/spots/${place.uuid}`
        setSpotLink(tempSpotLink) // for redirecting to the newly created spot

        // lets useeffect know that it can handle the data upload
        setDatabaseDataSet(true)

        // console.log(urls)
    }  

    // send data to database
    useEffect(() => {
        if (databaseDataSet) {
            if (place.category === 'skatepark') {
                set(ref(db, `/skateparks/${place.uuid}`), place)
                    .then(() => {
                        setDatabaseDataSet(false)
            
                        setLoading(false) 
                        setSubmitted(true)
                    })
                    .catch((error) => {
                        alert('error, try again or leave us a message')
                        console.log(error)
                    })
            } else {
                set(ref(db, `/spots/${place.uuid}`), place)
                    .then(() => {
                        setDatabaseDataSet(false)
            
                        setLoading(false) 
                        setSubmitted(true)
                    })
                    .catch((error) => {
                        alert('error, try again or leave us a message')
                        console.log(error)
                    })
            }
        }
    }, [databaseDataSet])  

    /**
     * paste lat and lng from google maps
     */
    function handlePaste(event) {
        event.preventDefault();
        const clipboardData = event.clipboardData.getData("Text")
        const values = clipboardData.split(",")
        if (values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
            setPlace(prevState => ({ ...prevState, lat: Number(values[0].trim()) }))
            setPlace(prevState => ({ ...prevState, lng: Number(values[1].trim()) })) 
        } else {
            // handle invalid input
        }
    }

    const categories = [
        {value: 'skatepark',    label: 'Skatepark'},
        {value: 'rail',         label: 'Rail'},
        {value: 'stairs',       label: 'Stairs'},
        {value: 'flat',         label: 'Flat'},
        {value: 'ledge',        label: 'Ledge'},
        {value: 'gap',          label: 'Gap'},
        {value: 'bank',         label: 'Bank'},
        {value: 'other',        label: 'Other'},
    ]


    // useEffect(() => console.log(place), [place])

    return (
        <div className = "editPlace mb-5 px-lg-0 px-4">

            <h1 className = "text-center mt-5 mb-2 fs-1 pt-4 fw-900">Upravit spot</h1>
            <p className = "text-center mb-4 container-medium fw-500 fs-4 mx-auto">Změnila se adresa nebo chceš přidat nové fotky?<br />Můžeš vše upravit!</p>
        
            <form onSubmit={handleSubmit} className = "">
                <div className = "container-small mx-auto">
                <label>
                    Název spotu:
                    <input required type="text" name="name" value={place.name} onChange={handleChange} />
                </label>

                {/* this is disabled bcs then i would have to switch between skateparks and spots in database which is f-ed up */}
                {/* <Select options={categories} required onChange = {(e) => setCategory(e)} placeholder = "Kategorie" value = {category} className = "mb-2 select" /> */}

                <div className = "row flex-wrap">
                    <div className = "col-lg-6 col-12 pe-lg-2">
                        <label>
                            Lat:
                            <input required type="number" step = "any" name="lat" value={place.lat} onChange={handleChange} onPaste={handlePaste} />
                        </label>
                    </div>
                    <div className = "col-lg-6 col-12 ps-lg-2">
                        <label>
                            Lng:
                            <input required type="number" step = "any" name="lng" value={place.lng} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <label>
                    Adresa:
                    <input required type="text" name="address" value={place.address} onChange={handleChange} />
                </label>
                <label>
                    Město:
                    <input required type="text" name="city" value={place.city} onChange={handleChange} />
                </label>
                <label>
                    Popis: 
                    <textarea required name="description" value={place.description} onChange={handleChange} />
                </label> 
                </div>
                <div className = "row flex-wrap container-large justify-content-center mx-auto">

                        {/* Přidej obrázky, můžeš zvolit více souborů (max 3):  */}
                        {place.images ? place?.images.map((image, index) => {
                            return (
                                <div className = {`col-lg-4 col-12 ${styles.imageLabel} p-3`} key = {index}>
                                    {image ? <button type = "button" className = {styles.delete} onClick = {() => deleteImage(index)}>&#10060;</button> : null}
                                    <label htmlFor = {`image${index}`}>
                                        <div className = {`${styles.imageInputLabel}`}>
                                            <div className = {`${styles.overlay}`}></div>
                                            {image ? <img src = {image} alt = "image" height = {350} /> : <div className = "center" style = {{height: 350}}><p className = "fw-900 fs-1 text-secondary">PŘIDEJ</p></div>}
                                            <input type="file" id={`image${index}`} name={`image${index}`} onChange={handleImageInputs} accept="image/png, image/gif, image/jpeg, image/webp" />
                                        </div>
                                    </label>
                                </div>
                            )
                        }): ''}
                        {place.images ? place?.images.length < 3 &&
                            <div className = {`col-lg-4 col-12 ${styles.imageLabel} p-3`}>
                                <label htmlFor = {`image${place.images.length}`} >
                                    <div className = {`${styles.imageInputLabel}`}>
                                        <div className = {`${styles.overlay}`}></div>
                                        <div className = "center" style = {{height: 350}}><p className = "fw-900 fs-1 text-secondary">PŘIDEJ</p></div>
                                        <input type="file" id={`image${place.images.length}`} name={`image${place.images.length}`} onChange={handleImageInputs} accept="image/png, image/gif, image/jpeg, image/webp" />
                                    </div>
                                </label>
                            </div>
                        : ''}
                    
                </div>
                {submitted ? 
                    <Link to = {spotLink} className = "mx-auto d-block">
                        <Button variant = "primary" type = "button" className = "mx-auto d-block">Zobrazit upravený spot</Button>
                    </Link>
                :
                    <Button variant = "primary loading" type = "submit" className = "mx-auto d-block" disabled = {loading ? true : false}>{submitted ? 'Upraveno!' : 'Upravit'}</Button>
                }
            </form>
        
        </div>
    )
}

export default EditPlace