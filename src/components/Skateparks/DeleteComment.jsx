
import { useEffect, useState } from "react"
import Button from "../Button" 
import { auth, db } from "../../firebase" 
import { set, ref, remove, onValue } from "firebase/database"
import { getAuth } from "firebase/auth"

const DeleteComment = ({ object, comment, children }) => {

    // make it universal for spots and skateparks
    const [place, setPlace] = useState({})
    useEffect(() => setPlace(object), [object]) 

    const [loading, setLoading] = useState(false)

    /**
     * gets all users from database
    */
    const [currentUser, setCurrentUser] = useState({})
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

    /**
     * deletes comment from database after user confirms
     */
    const [sure, setSure] = useState(false)
    const handleDelete = (bool) => {
        if (bool) {
            setLoading(true)

            if (place.category === "skatepark") {
                remove(ref(db, `/skateparks/${place.uuid}/comments/${comment.commentid}`))
                    .then(() => {
                        console.log('removed from skateparks database')
                        setSure(false)
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                remove(ref(db, `/spots/${place.uuid}/comments/${comment.commentid}`))
                    .then(() => {
                        console.log('removed from spots database')
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
                        <Button className = "mx-2" variant = "red loading" disabled = {loading ? true : false} onClick = {() => handleDelete(true)}>Ano</Button>
                        <Button className = "mx-2" variant = "red loading" onClick = {() => setSure(false)}>Ne</Button>
                    </div>
                </div>
                :
                children  
            }
        </div>
    )

}

export default DeleteComment