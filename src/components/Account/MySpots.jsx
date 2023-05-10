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
        let allPlaces = []
        if (places[0] && places[1]) allPlaces = Object.assign(places[0], places[1]) // join skateparks and spots
        if (currentUser.role ==='admin') {
            allPlaces ? allPlaces = Object.values(allPlaces) : allPlaces = []
            setUsersPlaces(allPlaces)
        } else {
            setUsersPlaces(findSkateparkByCreated())
        }
    }, [places])

    return (
        <div className = {`${styles.mySpots}`}>
            <div className = {`${styles.placesWrapper}`}>

                {usersPlaces.length === 0 &&
                    <div className = "">
                        <p className = "mt-2 fs-4 fw-400">Zatím jste nepřidali žádný spot</p>
                        <Button variant = "primary" className = "mt-2 mb-5 fs-5" >
                            <Link to = "/add-place">Přidej svůj první</Link>
                        </Button>
                    </div>}
                
                {usersPlaces.map((skatepark, index) => {
                    return (
                        <div key = {index} className = {`${styles.placeWrapper} row flex-wrap`} id = {skatepark.uuid}>
                            <div key = {index} className = {`${styles.place} col-md-8 col-12`}>
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
                            <div className = {`${styles.editdelete} ps-md-4 ps-3 col-md-4 col-12 flex-wrap my-auto`}>

                                <Link to = {`/edit-place/${skatepark?.uuid}`}><Button variant = "white" className = "d-md-block d-inline my-2">upravit</Button></Link>
                                
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