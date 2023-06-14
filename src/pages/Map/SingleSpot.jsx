import styles from './SingleSpot.module.scss'
import { useState, useEffect, useContext, useRef } from 'react'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import Carousel from '../../components/Carousel'
import Rating from '../../components/Rating'

import city from '../../assets/icons/single/single-city.png'
import categories from '../../assets/icons/single/single-categories.png'
import coords from '../../assets/icons/single/single-coords.png'
import location from '../../assets/icons/single/single-location.png'

import { db } from '../../firebase'
import { onValue, ref } from 'firebase/database' 
import { GlobalAuthorizedContext } from '../../context/GlobalAuthorizedContext' 


const SingleSpot = (props) => {
    const {
        selectedSpot, 
        setSelectedSpot, 
        spots, 
    } = props

    
    const topRef = useRef(null)
    const scrollToTop = () => {
        if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * copy coordinates to clipboard
     */
    const [copied, setCopied] = useState(false)
    const copyValue = (lat, lng) => {
        navigator.clipboard.writeText(`${lat}, ${lng}`) 
        setCopied(true) 
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    } 

    const { authorized } = useContext(GlobalAuthorizedContext)

    const [users, setUsers] = useState({}) 

    /**
     * Loads spot and users from database
     */
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
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
    const findUsersUsername = (uuid) => {
        let tempUser
        Object.values(users).map(user => {
            if (user.uuid === uuid) {
                tempUser = user
            }
        })
        return tempUser?.username
    } 

    return (
        <div className = {`${styles.SingleSpot}`}>

            <div className = "d-flex mb-5 pt-4 px-4 pointer" ref = {topRef} onClick = {() => {setSelectedSpot(null)}}>
                <div className = "me-2">
                    <svg className = "h-100" xmlns="http://www.w3.org/2000/svg" width="18.513" height="39.709" viewBox="0 0 18.513 39.709">
                        <path id="Path_1" data-name="Path 1" d="M3308.262,598.979l15.685,10.711,15.685-10.711" transform="translate(613.323 -3304.093) rotate(90)" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="6"/>
                    </svg>
                </div>
                <h1 className = "display-5 px-4 fw-800">{selectedSpot.name}</h1>
            </div>

            <div className = {`${styles.carousel} mx-4`}>
                <Carousel slides = {selectedSpot.images} interval = {5000} />
            </div>

            <div className = {`${styles.info} mt-4 px-4`}>
                <div className = "row pt-2">

                    <div className = "col-12 col-xl-6 justify-content-between d-flex flex-column ps-1">
                        {/* popis  */}
                        <div className = "">
                            <p className = "fw-bold fs-3">Popis</p>
                            <p className = "fs-4">{selectedSpot.description}</p>
                        </div>
                        {/* rating */}
                        <Rating 
                            black = {true} 
                            rating = {selectedSpot?.comments ? Object.values(selectedSpot.comments).map(comment => comment.rating) : []} 
                            width = {250} 
                        />
                    </div>

                    <div className = {`${styles.details} col-12 col-xl-6 ps-4`}>
                        {/* details */}
                        <div className = {styles.detail}>
                            <img src = {city} alt = "city icon" />
                            <p className = {styles.text}>{selectedSpot.city}</p>
                        </div>

                        <div className = {styles.detail}>
                            <img src = {categories} alt = "categories icon" />
                            <p className = {styles.text}>{selectedSpot.category}</p>
                        </div>
                        
                        <div className = {styles.detail}>
                            <img src = {location} alt = "address icon" />
                            <p className = {styles.text}>{selectedSpot.address}</p>
                        </div>

                        <div className = {`${styles.detail} ${styles.coords}`}>
                            <img src = {coords} alt = "coordinations icon" />
                            {copied ? 
                                <p className = {styles.text}>Zkopírováno do schránky</p> 
                                    : 
                                <p 
                                    className = {`${styles.copy} ${styles.text}`} 
                                    onClick = {() => copyValue(selectedSpot.lat, selectedSpot.lng)}
                                >
                                    {String(selectedSpot.lat).substring(0, 6)}, {String(selectedSpot.lng).substring(0, 6)}
                                </p>
                            }
                        </div>

                        {/* odkaz na gmaps  */}
                        <div className = {`${styles.gmapsLink}`}>
                            <Link to = {`https://www.google.com/maps/search/?api=1&query=${selectedSpot.lat}%2C${selectedSpot.lng}`} target = "_blank">
                                <p className = "text-gray fs-4 text-underline fw-600">Google Mapy</p>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <div className = {`${styles.discussion} mt-5 px-4`}>
                <h4 className = "fw-bold fs-3">Diskuze</h4>
                <p className = "text-gray fs-5 fw-500">poslední komentář</p>

                {selectedSpot?.comments ? Object.values(selectedSpot.comments).length > 0 &&
                    null : 
                    <p className = "fw-700 fs-4 mb-4">Zatím zde nejsou žádné komentáře :(</p>
                }
                
                {selectedSpot.comments ? Object.values(selectedSpot.comments).map((comment, index) => {
                    const userName = findUsersUsername(comment.user) 

                    if (index < 1) return (
                        <div className = {`${styles.comment} d-flex my-3`} id = {comment.commentid} key = {index}>

                            <div className = "pe-4 border-right">
                                <p className = "fw-600 w-max">{userName ? userName : 'unknown'}</p>
                                <Rating rating = {[comment.rating]} showCount = {false} width = {100} black = {true} />
                            </div>

                            <div className = {`${styles.right} ps-4`}>
                                <p className = {`${styles.text} fw-600`}>{comment.text}</p>
                            </div>

                            <div className = "ms-auto my-auto ps-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16.929" height="25.053" viewBox="0 0 16.929 25.053">
                                    <g id="Group_75" data-name="Group 75" transform="translate(-527.155 -880.124)">
                                        <path id="Path_511" data-name="Path 511" d="M0,0,6.347,5.657,12.694,0" transform="translate(541.966 887.79) rotate(180)" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="3"/>
                                        <path id="Path_512" data-name="Path 512" d="M3308.262,598.979l6.347,5.657,6.347-5.657" transform="translate(-2778.99 298.53)" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="3"/>
                                    </g>
                                </svg>
                            </div>


                        </div>
                    )
                }) : []} 
            </div>

            <div className = {`${styles.discussion} mt-5 pe-2`}>
                <h4 className = "fw-bold fs-3 px-4">Objev místa v okolí</h4>

                <div className = {`${styles.boxes} row flex-wrap mb-5`}>

                    {spots.map((spot, index) => {
                        const bgColor = () => {
                            if (spot.category === 'skatepark') return '#00D10E' 
                            else if (spot.category === 'rail') return '#1fdaa7' 
                            else if (spot.category === 'stairs') return '#FFC107' 
                            else if (spot.category === 'flat') return '#dc88ff' 
                            else if (spot.category === 'ledge') return '#009FD1' 
                            else if (spot.category === 'gap') return '#002AD1' 
                            else if (spot.category === 'bank') return '#5300D1' 
                            else if (spot.category === 'other') return '#D10069' 
                            else return '#00D10E' 
                        }
                        return (
                        <div className = {`${styles.boxWrapper}`} key = {index}>

                            <div className = {`${styles.box}`} onClick = {() => {
                                setSelectedSpot(spot)
                                scrollToTop()    
                            }}>
                                
                                <div className = {`${styles.header}`}>
                                    <img src = {spot.images[0]} alt = ""></img>
                                    <div className = {`${styles.overlay}`}></div>

                                    <div className = {`${styles.categoryLabel} row`} style = {{backgroundColor: bgColor()}}>
                                        <p>{spot.category}</p>
                                    </div>

                                </div>
                                
                                <div className = {`${styles.content}`}>
                                    <h3 className = {`${styles.title} mt-4 px-2`}>{spot.name}</h3>
                                    <div className = {`${styles.details} row flex-wrap py-3`}>
                                        <div className = {`${styles.titles} col-6 ps-2 pe-3 py-2 fs-55`}>
                                            <p>Kategorie</p>
                                            <p>Město</p>
                                            <p>Hodnocení</p>
                                        </div>
                                        <div className = {`${styles.values} col-6 ps-3 pe-2 py-2 fs-55`}>
                                            <p>Bank</p>
                                            <p>{spot.city}</p>
                                            <p>{spot.rating ? Math.round(spot.rating / 20 * 100) / 100 + ' / 5' : 'nehodnoceno'}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )})}

                </div>
                
            </div>

        </div>
    )
}

export default SingleSpot