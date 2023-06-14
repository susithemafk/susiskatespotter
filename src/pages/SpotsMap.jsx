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
import Draggable from "react-draggable"
    
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
    const pageHeight = window.innerHeight - 85 // - header height
    const [divPosition, setDivPosition] = useState({ x: 0, y: pageHeight * 0.95 }) 
    const draggableRef = useRef(null)

    // active dragging function
    const handleDragEnd = (e, ui) => {
        const { y } = ui
        console.log(pageHeight, y) 

        const isBottom = divPosition.y === pageHeight * 0.95
        const isTop = divPosition.y === pageHeight * 0.1
        const isCenter = divPosition.y === pageHeight * 0.45 

        if (isBottom) {
            if (y < pageHeight * 0.9) {
                setDivPosition({ x:0, y: pageHeight * 0.45 }) // center position
            }
        } 
        if (isCenter) {
            if (y < pageHeight * 0.45) {
                setDivPosition({ x:0, y: pageHeight * 0.1 }) // top position
            } else if (y > pageHeight * 0.55) {
                setDivPosition({ x:0, y: pageHeight * 0.95 }) // bottom position
            }
        } 
        if (isTop) {
            if (y > pageHeight * 0.25) {
                setDivPosition({ x:0, y: pageHeight * 0.45 }) // center position
            }
        }

        // if (y < pageHeight * 0.2) { // 30% of page height, move it to top, also skatepark has to be active
        //     console.log('move top')
        //     if (selectedSkatepark) {
        //         setDivPosition({ x:0, y: 40 })
        //     }
        // } else if (y > pageHeight * 0.65) { // 100px from bottom, move it to bottom
        //     console.log('move bottom')
        //     setDivPosition({ x:0, y: pageHeight * 0.95 }) 
        // } else {
        //     console.log('move center')
        //     if (selectedSkatepark) {
        //         setDivPosition({ x:0, y: pageHeight * 0.45 }) // center position, also skatepark has to be active
        //     }
        // }
    }

    useEffect(() => {
        if (selectedSkatepark) {
            setDivPosition({ x:0, y: pageHeight * 0.45 }) // center position, also skatepark has to be active
        } else {
            setDivPosition({ x:0, y: pageHeight * 0.95 }) // bottom position
        }
    }, [selectedSkatepark])

    
    return (
        <div className = {`${styles.spotsMap} overflow-hidden`}>

            <div ref = {wrapperRef} className = {`${styles.wrapper}`}>
                <Map skateparks = {skateparks} selectedSkatepark = {selectedSkatepark} setSelectedSkatepark = {setSelectedSkatepark} />

                <Draggable
                    axis="y" 
                    onStop = {handleDragEnd}
                    // bounds="parent" 
                    disabled = {!selectedSkatepark}
                    position={divPosition}
                    nodeRef={draggableRef}
                >
                    <div className = {`${styles.detailWindowWrapper} pt-4 top-0`}>
                        <div className = {styles.detailWindow}>
                            
                            <div  ref={draggableRef} className = {styles.dragger} >
                                <hr />
                            </div>
                                
                            <h3 className = "px-4 fs-1 pt-2">{selectedSkatepark?.name}</h3>
                            <div className="px-4">
                                <Rating rating = {selectedSkatepark?.comments ? Object.values(selectedSkatepark.comments).map(comment => comment.rating) : []} width = {150} black = {true} />
                                <p className = "fs-3 my-2">{selectedSkatepark?.address} - {selectedSkatepark?.city}</p>
                                <Link to = {`/${selectedSkatepark?.category === 'skatepark' ? 'skateparks' : 'spots'}/${selectedSkatepark?.uuid}`}>
                                    <Button variant = "primary" className = {`${styles.detailButton} mb-2 me-3 px-4 fs-5 fw-800 mt-1  montserrat`}>Detail</Button>
                                </Link>
                                <Link to = {`https://www.google.com/maps/search/?api=1&query=${selectedSkatepark?.lat}%2C${selectedSkatepark?.lng}`} target = "_blank">
                                    <Button variant = "primary" className = {`${styles.detailButton} mb-3 fs-5 px-4 fw-800 mt-1 montserrat`}>Google Mapy</Button>
                                </Link>
                            </div>
                            <div className = {`${styles.imgSlider} mb-4`}>
                                {selectedSkatepark?.images.map((image, index) => (
                                    <div className = {`${styles.imgWrapper}`}>
                                        <img key = {index} src = {image} alt = "" />
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </Draggable>
            </div>

            
            {/* <div className = {`${styles.detailWindowWrapper} ${selectedSkatepark ? '' : styles.hidden} p-4`} style={{
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
            </div> */}

        </div>

    )
}

export default SpotsMap