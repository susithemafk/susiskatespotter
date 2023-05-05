
import { db } from "../../firebase" 
import { ref, remove } from "firebase/database"
import { useState, useEffect } from "react" 
import Button from '../Button' 


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
            // remove(ref(db, `/users/${currentUser.uuid}/comments/${comment.commentid}`))
            //     .then(() => {
            //         console.log('removed from user database')
            //         setSure(false)
            //         setLoading(false)
                        
            //     })
            //     .catch((error) => {
            //         alert('error, try again later or leave us a message')
            //         console.log(error)
            //     })
        }

    } 

    return (
        <div className = "text-end" onClick = {() => !sure ? setSure(true) : ''}>
            {sure ? 
                <div>
                    <p className = "text-end mb-3 fw-600">Opravdu smazat?</p>
                    <div className = "d-flex justify-content-end">
                        <Button className = "mx-2" variant = "secondary loading" disabled = {loading ? true : false} onClick = {() => deleteMyPlace(place, true)}>Ano</Button>
                        <Button className = "mx-2" variant = "secondary loading" onClick = {() => setSure(false)}>Ne</Button>
                    </div>
                </div>
                :
                <Button variant = "secondary" className = "d-block my-2">smazat</Button>  
            }
        </div>
    )
}

export default DeleteMySpot