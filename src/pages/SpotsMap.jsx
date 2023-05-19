import { useEffect, useState, useMemo } from "react" 

import { db } from '../firebase'  
import { uuid } from 'uuid'  
import { set, ref, onValue, remove } from 'firebase/database' 

import { useRef } from "react" 

import Button from '../components/Button'
import Map from '../components/Map'
import DropdownMultiple from "../components/DropdownMultiple"

import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from "@react-google-maps/api"

import styles from './SpotsMap.module.scss' 

import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import Rating from "../components/Rating"
    
const SpotsMap = () => {


    const [loading, setLoading] = useState(true) 
    const [skateparks, setSkateparks] = useState([])
    /**
     * Loads skateparks from database
     */
    useEffect(() => {
        let tempSkatespots = []
        onValue(ref(db), (snapshot) => {
            const data = snapshot.val()
            if (data !== null) {
                tempSkatespots = [...tempSkatespots, ...Object.values(data.skateparks)]
                tempSkatespots = [...tempSkatespots, ...Object.values(data.spots)] 
                setLoading(false)
            } else {
                setSkateparks([])
            }

            setSkateparks(tempSkatespots)
        })  
    }, []) 

    /**
     * set active/selected spot
     */
    const [selectedSkatepark, setSelectedSkatepark] = useState(null) 

    /**
     * sets height of wrapper for safari, then set up in scss by %
     */
    const wrapperRef = useRef(null)
    const setHeightsForSafari = () => {
        const pageHeight = window.innerHeight - 85 // - header height

        if (wrapperRef.current) {
            wrapperRef.current.style.maxHeight = `${pageHeight}px`
            wrapperRef.current.style.minHeight = `${pageHeight}px`
            wrapperRef.current.style.height = `${pageHeight}px`
        }
    } 
    useEffect(() => {
        setHeightsForSafari()
    }, []) 

    useEffect(() => console.log(selectedSkatepark), [selectedSkatepark])



    // Drag functionality
    const [divPosition, setDivPosition] = useState({ y: 450 }) 
    const [divHeight, setDivHeight] = useState(55) // change height of div if on top

    // active dragging function
    const pageHeight = window.innerHeight - 85 // - header height
    const handleDivDrag = (event) => {
        setDivPosition({ y: event.touches[0] - 85 })
    }

    // drag end function
    const handleDragEnd = (event) => {
        const { clientY } = event.changedTouches[0]

        if (clientY < pageHeight * 0.4) { // 30% of page height, move it to top, also skatepark has to be active
            if (selectedSkatepark) {
                setDivPosition({ y: 40 })
                setDivHeight(100)
            }
        } else if (clientY > pageHeight - 100) { // 100px from bottom, move it to bottom
            setDivPosition({ y: '95%' }) 
            setDivHeight(55)
        } else {
            if (selectedSkatepark) {
                setDivPosition({ y: '45%' }) // center position, also skatepark has to be active
                setDivHeight(55)
            }
        }
    }

    useEffect(() => {
        if (selectedSkatepark) {
            setDivPosition({ y: '45%' })
        } else {
            setDivPosition({ y: '95%' })
        }
    }, [selectedSkatepark])

    
    return (
        <div className = {`${styles.spotsMap} overflow-hidden`}>

            <div ref = {wrapperRef} className = {`${styles.wrapper}`}>
                <Map skateparks = {skateparks} selectedSkatepark = {selectedSkatepark} setSelectedSkatepark = {setSelectedSkatepark} />
            </div>

            <div className = {`${styles.detailWindowWrapper} ${selectedSkatepark ? '' : styles.hidden} p-4`} style={{
                    position: 'absolute',
                    top: divPosition.y, 
                    height: divHeight + '%', 
                }}>
                <div className = {styles.detailWindow}>
                    
                    <div className = {styles.dragger} onTouchMoveCapture={handleDivDrag} onTouchEnd = {handleDragEnd}>
                        <hr />
                    </div>
                        
                    <h3 className = "fs-1 pt-2">{selectedSkatepark?.name}</h3>
                    <Rating rating = {selectedSkatepark?.comments ? Object.values(selectedSkatepark.comments).map(comment => comment.rating) : []} width = {150} black = {true} />
                    <p className = "fs-3 my-2">{selectedSkatepark?.address} - {selectedSkatepark?.city}</p>
                    <Link to = {`/${selectedSkatepark?.category === 'skatepark' ? 'skateparks' : 'spots'}/${selectedSkatepark?.uuid}`}>
                        <Button variant = "primary" className = {`${styles.detailButton} mb-2 me-3 px-4 fs-5 fw-800 mt-1  montserrat`}>Detail</Button>
                    </Link>
                    <Link to = {`https://www.google.com/maps/search/?api=1&query=${selectedSkatepark?.lat}%2C${selectedSkatepark?.lng}`} target = "_blank">
                        <Button variant = "primary" className = {`${styles.detailButton} mb-3 fs-5 px-4 fw-800 mt-1 montserrat`}>Google Mapy</Button>
                    </Link>
                    <div className = {`${styles.imgSlider} mb-4`}>
                        {selectedSkatepark?.images.map((image, index) => (
                            <div className = {styles.imgWrapper}>
                                <img key = {index} src = {image} alt = "" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

    )
}

export default SpotsMap