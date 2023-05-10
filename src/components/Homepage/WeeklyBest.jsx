import styles from './WeeklyBest.module.scss'
import Carousel from '../Carousel'
import Rating from '../Rating'
import { Link } from 'react-router-dom'
import Button from '../Button' 

import { useEffect, useState } from 'react' 
import { getAuth } from 'firebase/auth' 
import { ref, onValue } from 'firebase/database' 
import { db } from '../../firebase' 

const WeeklyBest = ({ children, places }) => {

    const [users, setUsers] = useState({})
    const [favPlace, setFavPlace] = useState({})
    const [placeOwner, setPlaceOwner] = useState({})

    /**
     * gets all users from database
     */
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            // gets all data from database
            const data = snapshot.val()

            if (data !== null) {
                setUsers(data.users)
            }
        })
    }, [])  

    /**
     * if id of user that commented === spot id, 
     * return his username
     */
    useEffect(() => {
        let tempUser
        Object.values(users).map(user => {
            if (user.uuid === favPlace?.createdby) {
                tempUser = user
            }
        })
        setPlaceOwner(tempUser)
    }, [users, favPlace])


    useEffect(() => {
        const tempPlaces = Object.values(places)

        // add calculated rating to skateparks - skatepark.rating = 0 - 100
        tempPlaces.map(spot => {
            if (spot.comments) { 
                const tempComments = Object.values(spot.comments) 
                const tempRating = tempComments.reduce((a, b) => a + b.rating, 0) / tempComments.length 
                return spot.rating = tempRating
            } else {
                return spot.rating = 0
            }
        }) 
        
        // sort by most favorite
        const sortedPlaces = tempPlaces.sort((a, b) => {
            return b.rating - a.rating
        }) 

        // set most favorite place
        setFavPlace(sortedPlaces[0])
        
    }, [places])



    return (
        <div className = {`${styles.weeklyBest} text-center bg-primary pt-lg-5 pt-4 pb-4 px-4 fw-700`}>

            <h2 className = "fs-2 fw-900 mb-4">{children}</h2>
    
            <div className = {styles.carousel}>
                <Carousel slides = {favPlace?.images} interval = {5000} />
            </div>
    
            <h3 className = "my-3 fs-3">{favPlace?.name}</h3>
    
            {/* <Rating rating = {[comment.rating]} showCount = {false} width = {100} black = {true} /> */}
    
            <p className = {`${styles.ratingCount} fs-5`}>{favPlace?.comments ? Object.values(favPlace?.comments).length : 0} hodnocení</p>
            <p className = {`${styles.rating} my-2 fs-5`}>&#9733;  {Math.round(favPlace?.rating / 20 * 100) / 100} / 5  &#9733;</p>
            <p className = {`${styles.addedBy} mb-3 fs-5`}>Přidal: {placeOwner?.username || 'unknown'}</p>

            <Link to = {`/${favPlace?.category === 'skatepark' ? 'skateparks' : 'spots'}/${favPlace?.uuid}`}>
                <Button variant = "white" className = "fs-5 mb-1">detail</Button>
            </Link>

        </div>
    )
}

export default WeeklyBest