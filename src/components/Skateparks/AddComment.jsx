
import { useEffect, useState } from "react"
import Button from "../Button" 
import styles from './AddComment.module.scss'
import { auth, db } from "../../firebase" 
import { set, ref } from "firebase/database"
import { uid } from "uid"

const AddComment = ({ skatepark, spot, isSkatepark=true, users }) => {

    // make it universal for spots and skateparks
    const [object, setObject] = useState({})
    useEffect(() => {
        if (isSkatepark) {
            setObject(skatepark)
        } else {
            setObject(spot)
        }
    }, [skatepark, spot])

    const [userComment, setUserComment] = useState('')
    const [userRating, setUserRating] = useState(0)

    const handleRadioChange = (event) => {
        setUserRating(event.target.value);
    } 

    const handleSubmit = (e) => {
        const currentUserEmail = auth.currentUser?.email
        const currentUserFromDb = Object.values(users).find(user => user.email === currentUserEmail) 

        const uuid = uid()
        // new comment object
        const comment ={
            date: Date.now(), 
            rating: Number(userRating), 
            text: userComment, 
            user: currentUserFromDb.uuid, 
            where: object.uuid, 
            commentid: uuid
        } 
        // added comment to object in db
        if (!object.hasOwnProperty('comments')) {object.comments = []}
        if (!object.hasOwnProperty('rating')) {object.rating = []}
        // added comment to current user in db
        if (!currentUserFromDb.hasOwnProperty('comments')) {currentUserFromDb.comments = []}
        
        e.preventDefault()
        if (userRating != 0) {
            setUserComment('')
            setUserRating(0)

            if (isSkatepark) {
                set(ref(db, `/skateparks/${object.uuid}/comments/${comment.commentid}`), comment)
                    .then(() => {
                        console.log('success') 
                    })
                    .catch((error) => {
                        alert('error, try again or leave us a message')
                        console.log(error)
                    })
            } else {
                set(ref(db, `/spots/${object.uuid}/comments/${comment.commentid}`), comment)
                    .then(() => {
                        console.log('success') 
                    })
                    .catch((error) => {
                        alert('error, try again or leave us a message')
                        console.log(error)
                    })
            }
            // set(ref(db, `/users/${currentUserFromDb.uuid}/comments/${comment.commentid}`), comment)
            //     .then(() => {
            //         console.log('success') 
            //     })
            //     .catch((error) => {
            //         alert('error, try again or leave us a message')
            //         console.log(error)
            //     })
        }
    }


    return (
        <form onSubmit = {handleSubmit} className = "my-4">
            <textarea required type = "text" value = {userComment} placeholder = "Text" maxLength={500} onChange = {e => setUserComment(e.target.value)} className = "mb-0" />

            <div className = {styles.rate}>
                <input type="radio" id="star5" name="rate" value="100" checked={userRating === '100'} onChange={handleRadioChange} />
                <label htmlFor="star5" title="text">5 stars</label>
                <input type="radio" id="star4" name="rate" value="80" checked={userRating === '80'} onChange={handleRadioChange} />
                <label htmlFor="star4" title="text">4 stars</label>
                <input type="radio" id="star3" name="rate" value="60" checked={userRating === '60'} onChange={handleRadioChange} />
                <label htmlFor="star3" title="text">3 stars</label>
                <input type="radio" id="star2" name="rate" value="40" checked={userRating === '40'} onChange={handleRadioChange} />
                <label htmlFor="star2" title="text">2 stars</label>
                <input type="radio" id="star1" name="rate" value="20" checked={userRating === '20'} onChange={handleRadioChange} />
                <label htmlFor="star1" title="text">1 star</label>
            </div>

            <Button variant = "primary" className = "mt-5 d-block" type = "submit" text = "Sign Out">Přidat</Button>
        </form>
    )

}

export default AddComment