
import { useState, useEffect } from 'react' 

import { db, storage } from '../firebase' 
import { uid } from 'uid'  
import { set, ref } from 'firebase/database' 
import { ref as storageRef } from 'firebase/storage' 
import Button from '../components/Button'
import { getDownloadURL, uploadBytes } from 'firebase/storage' 
import { getAuth } from 'firebase/auth'
import { onValue } from 'firebase/database' 
import imageCompression from 'browser-image-compression'
import { Link } from 'react-router-dom'

import Select from 'react-select';

const AddPlace = () => {
    const defaultSkatepark = {
        uuid: '', 
        name: '', 
        lat: '', 
        lng: '',
        address: '', 
        city: '', 
        description: '', 
        images: [], 
        createdate: '', 
        createdby: '', 
        category: '', 
    }

    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [skatepark, setSkatepark] = useState(defaultSkatepark)  
    const [category, setCategory] = useState('skatepark')

    const [currentUser, setCurrentUser] = useState(null) 

    const [spotLink, setSpotLink] = useState('')

    /**
     * gets current user from database
     */
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            // gets all data from database
            const data = snapshot.val()

            // sets current user from database
            const auth = getAuth() 
            const user = Object.values(data?.users).find(user => user.email === auth.currentUser.email) 
            setCurrentUser(user)
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target 

        if (name === 'lat' || name === 'lng') {
            setSkatepark(prevState => ({ ...prevState, [name]: Number(value) })) 
        } else {
            setSkatepark(prevState => ({ ...prevState, [name]: value })) 
        }

        setSubmitted(false)
    } 

    function handlePaste(event) {
        event.preventDefault();
        const clipboardData = event.clipboardData.getData("Text")
        const values = clipboardData.split(",")
        if (values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
            setSkatepark(prevState => ({ ...prevState, lat: Number(values[0].trim()) }))
            setSkatepark(prevState => ({ ...prevState, lng: Number(values[1].trim()) })) 
        } else {
            // handle invalid input
        }
    }

    /**
     * begins the whole process of uploading data to database and storage
     */
    const handleSubmit = (e) => {
        e.preventDefault()
        writeToDatabase()
    }  

    /**
     * resets form to default values
     */
    const resetForm = () => {
        setSkatepark(defaultSkatepark) 
        document.querySelector('input[name="images"]').value = ''
    }
    

    // images input 
    const handleImageChange = (e) => {

        const imagesWithNewName = Array.from(e.target.files).map((file) => {
            const newFileName = `${Date.now()}-${file.name}`;
            const tempImage = new File([file], newFileName, { type: file.type })
            return tempImage
        })

        if (e.target.files.length > 3) {
            alert("Only 3 files accepted.")
            document.querySelector('input[name="images"]').value = ''
        } else {
            setSkatepark(prevState => ({ ...prevState, images: imagesWithNewName }))
            // setSkatepark(prevState => ({ ...prevState, images: Array.from(e.target.files) }))
        }
    } 

    /**
     * use browser-image-compression to compress images
     */
    const compressImages = async (images) => {
        const compressedImages = []

        for (const image of images) {
            const compressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800, 
            }
            try {
                const compressedImage = await imageCompression(image, compressionOptions)
                compressedImages.push(compressedImage)
            } catch (error) {
                console.log('error compressing images')
                console.log(error)
            }
        }
        setSkatepark(prevState => ({ ...prevState, images: compressedImages }))
        return compressedImages
    }

    // uploads images to firebase storage and returns an array of urls
    const handleFileUpload = async () => {
        console.log('writing to database - handling file upload')
        const urls = []
        if (skatepark.images.length > 0) {

            const compressedImages = await compressImages(skatepark.images)

            await Promise.all(compressedImages.map((image, index) => {
                const imageRef = storageRef(storage, `/images/${image.name}`)
                const uploadTask = uploadBytes(imageRef, image)

                return uploadTask

                .then(snapshot => {
                    console.log('Upload successful:', snapshot)

                    return getDownloadURL(snapshot.ref)
                        .then((downloadURL) => {
                            urls.push(downloadURL)
                        })
                        .catch(err => {
                            console.log('Error:', err)
                        })
                })
                .catch(error => {
                    console.log('Error:', error)
                })
                
            }))
        }
        return urls
    }
      

    // updates uuid and images and sends impulse to useEffect
    const [databaseDataSet, setDatabaseDataSet] = useState(false)
    const writeToDatabase = async () => {
        console.log('writing to database - start')
        setLoading(true)

        const uuid = uid() 
        const urls = await handleFileUpload()

        setSkatepark(prevState => ({ ...prevState, images: urls }))
        setSkatepark(prevState => ({ ...prevState, uuid: uuid })) 
        setSkatepark(prevState => ({ ...prevState, createdate: Date.now() })) 
        setSkatepark(prevState => ({ ...prevState, createdby: currentUser.uuid })) 
        setSkatepark(prevState => ({ ...prevState, category: category.value }))

        const tempSpotLink = skatepark.category === 'skatepark' ? `/skateparks/${uuid}` : `/spots/${uuid}`
        setSpotLink(tempSpotLink) // for redirecting to the newly created spot

        // lets useeffect know that it can handle the data upload
        setDatabaseDataSet(true)
    }  

    // send data to database
    useEffect(() => {
        if (databaseDataSet) {
            if (skatepark.category === 'skatepark') {
                set(ref(db, `/skateparks/${skatepark.uuid}`), skatepark)
                    .then(() => {
                        setDatabaseDataSet(false)
            
                        setLoading(false) 
                        setSubmitted(true)
                        resetForm()
                    })
                    .catch((error) => {
                        alert('error, try again or leave us a message')
                        console.log(error)
                    })
            } else {
                set(ref(db, `/spots/${skatepark.uuid}`), skatepark)
                    .then(() => {
                        setDatabaseDataSet(false)
            
                        setLoading(false) 
                        setSubmitted(true)
                        resetForm()
                    })
                    .catch((error) => {
                        alert('error, try again or leave us a message')
                        console.log(error)
                    })
            }
        }
    }, [databaseDataSet]) 

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
      


    return (
        <div className = "mb-5 px-lg-0 px-4">
            <h1 className = "text-center mt-5 mb-2 fs-1 pt-4 fw-900">{submitted ? "Úspěšně přídán, díky!" : "Přidej nový spot"}</h1>
            <p className = "text-center mb-4 container-medium fw-500 fs-4 mx-auto">Máš svůj oblíbený street spot nebo skatepark, který zde chybí?<br /> Poděl se s ostatníma!</p>

            <form onSubmit={handleSubmit} className = "container-small mx-auto">
                <label>
                    Název spotu:
                    <input required type="text" name="name" value={skatepark.name} onChange={handleChange} />
                </label>

                <Select options={categories} required onChange = {(e) => setCategory(e)} placeholder = "Kategorie" value = {category} className = "mb-2 select" />

                <div className = "row flex-wrap">
                    <div className = "col-lg-6 col-12 pe-lg-2">
                        <label>
                            Lat:
                            <input required type="number" step = "any" name="lat" value={skatepark.lat} onChange={handleChange} onPaste={handlePaste} />
                        </label>
                    </div>
                    <div className = "col-lg-6 col-12 ps-lg-2">
                        <label>
                            Lng:
                            <input required type="number" step = "any" name="lng" value={skatepark.lng} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <label>
                    Adresa:
                    <input required type="text" name="address" value={skatepark.address} onChange={handleChange} />
                </label>
                <label>
                    Město:
                    <input required type="text" name="city" value={skatepark.city} onChange={handleChange} />
                </label>
                <label>
                    Popis: 
                    <textarea required name="description" value={skatepark.description} onChange={handleChange} />
                </label> 
                <label>
                    Přidej obrázky, můžeš zvolit více souborů (max 3): 
                    <input required type="file" name="images" onChange={handleImageChange} multiple accept="image/png, image/gif, image/jpeg, image/webp" />
                </label>
                {submitted ? 
                <Link to = {spotLink} className = "mx-auto d-block">
                    <Button variant = "primary" type = "button" className = "mx-auto d-block">Zobrazit spot</Button>
                </Link>
                :
                <Button variant = "primary loading" type = "submit" className = "mx-auto d-block" disabled = {loading ? true : false}>{submitted ? 'OK' : 'Přidat'}</Button>
                }
            </form>

            <div className = "help pb-4">
                <h4 className = "text-center mt-5 mb-2 fs-2 pt-4 fw-800">Nevíš si rady?</h4>
                <Link to = "/how-to-add">
                    <Button variant = "primary" className = "d-block mx-auto">jak přidat spot</Button>
                </Link>
            </div>
        </div>
    )
}

export default AddPlace