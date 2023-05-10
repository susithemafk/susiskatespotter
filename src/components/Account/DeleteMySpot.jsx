
import { db, storage } from "../../firebase" 
import { ref, remove } from "firebase/database"
import { useState, useEffect } from "react" 
import Button from '../Button' 
import { ref as storageRef, deleteObject } from "firebase/storage"


const DeleteMySpot = ({ place }) => {
    const [sure, setSure] = useState(false)
    const [loading, setLoading] = useState(false)

    const deleteMyPlace = (place, bool) => {
        setLoading(true)

        if (bool) {
            if (place.category === "skatepark") {
                remove(ref(db, `/skateparks/${place.uuid}`))
                    .then(() => {
                        console.log('removed skatepark from database')
                        setSure(false)
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                remove(ref(db, `/spots/${place.uuid}`))
                    .then(() => {
                        console.log('removed spot from database')
                        setSure(false)
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
        console.log(place)

        // delete images that were deleted from the place
        const imagesToDelete = place.images 
        imagesToDelete?.map(image => {
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

    return (
        <div className = "d-inline ms-md-0 ms-3" onClick = {() => !sure ? setSure(true) : ''}>
            {sure ? 
                <div>
                    <p className = "mb-3 fw-600">Opravdu smazat?</p>
                    <div className = "d-flex flex-wrap">
                        <Button className = "mx-2" variant = "red" onClick = {() => setSure(false)}>Ne</Button>
                        <Button className = "mx-2 mt-md-2" variant = "red loading" disabled = {loading ? true : false} onClick = {() => deleteMyPlace(place, true)}>Ano</Button>
                    </div>
                </div>
                :
                <Button variant = "red" className = "d-md-block d-inline my-2">smazat</Button>  
            }
        </div>
    )
}

export default DeleteMySpot