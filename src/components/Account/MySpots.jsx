import { useEffect, useState } from 'react'
import styles from './MySpots.module.scss'
import Button from '../Button' 
import { Link } from 'react-router-dom'  
import DeleteMySpot from './DeleteMySpot'

const MySpots = ({ places, currentUser }) => {

    /**
     * @returns all skateparks created by user
     */
    const [usersPlaces, setUsersPlaces] = useState([])

    const findSkateparkByCreated = () => {
        let allPlaces = []
        let placesByUser = [] //comments made by user
        if (places[0] && places[1]) allPlaces = Object.assign(places[0], places[1]) // join skateparks and spots

        const a = allPlaces ? Object.values(allPlaces).map(place => {
            if (place?.createdby === currentUser?.uuid) {
                placesByUser.push(place)
            }
        }) : null 

        return placesByUser
    } 

    useEffect(() => {
        setUsersPlaces(findSkateparkByCreated())
    }, [places])

    return (
        <div className = {`${styles.mySpots}`}>
            <div className = {`${styles.placesWrapper}`}>
                
                {usersPlaces.map((skatepark, index) => {
                    return (
                        <div key = {index} className = {`${styles.placeWrapper} row flex-wrap`}>
                            <div key = {index} className = {`${styles.place} col-xl-8 col-12`}>
                                <Link to = {`/${skatepark?.category === 'skatepark' ? 'skateparks' : 'spots'}/${skatepark?.uuid}`}>
                                    <div className = "p-3">

                                        <div className = {styles.background}>
                                            <img src = {skatepark?.images[0]}></img>
                                            <div className = {styles.overlay}></div>
                                        </div>
                                        <div className = {`${styles.content} row justify-content-between w-100 p-4`}>
                                            <h3 className = "px-3 fs-4 mt-auto mb-2">{skatepark?.name}</h3>
                                        </div>

                                    </div>

                                </Link>
                            </div>
                            <div className = {`${styles.editdelete} ms-4 my-auto`}>
                                <Button variant = "white" className = "d-block my-2">upravit</Button> 
                                
                                <DeleteMySpot place = {skatepark} />

                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}   

export default MySpots