
import { useState, useEffect } from 'react' 

import { db, storage } from '../firebase' 
import { uid } from 'uid'  
import { set, ref } from 'firebase/database' 
import { ref as storageRef } from 'firebase/storage' 
import Button from '../components/Button'
import { getDownloadURL, uploadBytes } from 'firebase/storage'


const AddSpot = () => {
    const defaultSpot = {
        uuid: '', 
        name: '', 
        lat: '', 
        lng: '',
        address: '', 
        city: '', 
        description: '', 
        rating: '', 
        images: [], 
        createdate: '', 
        createdby: '', 
    }

    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [spot, setSpot] = useState(defaultSpot) 

    const handleChange = (e) => {
        const { name, value } = e.target 

        if (name === 'lat' || name === 'lng') {
            setSpot(prevState => ({ ...prevState, [name]: Number(value) })) 
        } else {
            setSpot(prevState => ({ ...prevState, [name]: value })) 
        }

        setSubmitted(false)
    } 

    
    const handleSubmit = (e) => {
        e.preventDefault()
        writeToDatabase()
    }  

    const resetForm = () => {
        setSpot(defaultSpot) 
        document.querySelector('input[name="images"]').value = ''
    }

    // images input 
    const handleImageChange = (e) => {
        if (e.target.files.length > 3) {
            alert("Only 3 files accepted.")
            document.querySelector('input[name="images"]').value = ''
        } else {
            setSpot(prevState => ({ ...prevState, images: Array.from(e.target.files) }))
        }
    } 
    
    // uploads images to firebase storage and returns an array of urls
    const handleFileUpload = async () => {
        console.log('writing to database - handling file upload')
        const urls = []
        if (spot.images.length > 0) {

            await Promise.all(spot.images.map((image, index) => {
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

        setSpot(prevState => ({ ...prevState, images: urls }))
        setSpot(prevState => ({ ...prevState, uuid: uuid })) 
        setSpot(prevState => ({ ...prevState, createdate: Date.now() })) 

        // lets useeffect know that it can handle the data upload
        setDatabaseDataSet(true)
    }  

    // send data to database
    useEffect(() => {
        if (databaseDataSet) {
            set(ref(db, `/spots/${spot.uuid}`), spot)
                .then(() => {
                    console.log('uploaded successfully') 
                    setDatabaseDataSet(false)
                    setLoading(false) 
                    setSubmitted(true)
                    resetForm()
                })
                .catch((error) => {
                    alert('error, try again or leave us a message')
                    console.log(error)
                    setLoading(false)
                })
        }
    }, [databaseDataSet]) 

    return (
        <div className = "px-lg-0 px-4">
            <h1>Add Skatespot</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input required type="text" name="name" value={spot.name} onChange={handleChange} />
                </label>
                <div className = "row flex-wrap">
                    <div className = "col-lg-6 col-12 pe-lg-2">
                        <label>
                            Lat:
                            <input required type="number" step = "any" name="lat" value={spot.lat} onChange={handleChange} />
                        </label>
                    </div>
                    <div className = "col-lg-6 col-12 ps-lg-2">
                        <label>
                            Lng:
                            <input required type="number" step = "any" name="lng" value={spot.lng} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <label>
                    Address:
                    <input required type="text" name="address" value={spot.address} onChange={handleChange} />
                </label>
                <label>
                    City:
                    <input required type="text" name="city" value={spot.city} onChange={handleChange} />
                </label>
                <label>
                    Description: 
                    <textarea required name="description" value={spot.description} onChange={handleChange} />
                </label> 
                <label>
                    Images (max 3): 
                    <input required type="file" name="images" onChange={handleImageChange} multiple accept="image/png, image/gif, image/jpeg" />
                </label>

                <Button variant = "primary loading" type = "submit" className = "mx-auto d-block" disabled = {loading ? true : false}>{submitted ? 'Successfully submitted' : 'Submit'}</Button>
            </form>
        </div>
    )
}

export default AddSpot