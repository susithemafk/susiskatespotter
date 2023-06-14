
import Map from './Map/Map'
import MapList from './Map/List'
import styles from './Map2.module.scss'

import { useRef, useEffect, useState, useReducer } from 'react'
import { db } from '../firebase'
import { ref, onValue } from 'firebase/database'
import { useLocation } from 'react-router-dom'
import SingleSpot from './Map/SingleSpot'


const Map2 = () => {

    /**
     * sets height of wrapper for safari, then set up in scss by %
     */
    const [isMobile, setIsMobile] = useState(false)
    const wrapperRef = useRef(null)
    const setHeightsForSafari = () => {
        const pageHeight = window.innerHeight - 85 // - header height

        const calculateSafariBrowserHeight = () => {
            const urlBarHeight = window.innerHeight - document.documentElement.clientHeight
            const safariBrowserHeight = window.innerHeight - urlBarHeight - 85

            if (wrapperRef.current) {
                wrapperRef.current.style.height = `${safariBrowserHeight}px`
            }
        }
        calculateSafariBrowserHeight()
    } 
    useEffect(() => {
        setHeightsForSafari()
    }, []) 
    useEffect(() => {
        const pageWidth = window.innerWidth
        if (pageWidth < 1100) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }, [])

    const location = useLocation()

    /**
     * Loads all spots from database
     */ 
    const [spots, setSpots] = useState([])
    useEffect(() => {
        let tempSpots = []
        onValue(ref(db), (snapshot) => {
            const data = snapshot.val()
            if (data !== null) { 
                // tempSpots = tempSpots.concat(Object.values(data.spots), Object.values(data.spots))
                tempSpots = [...tempSpots, ...Object.values(data.skateparks)]
                tempSpots = [...tempSpots, ...Object.values(data.spots)]
            } 

            // add calculated rating to spots - skatepark.rating = 0 - 100
            tempSpots.map(spot => {
                if (spot.comments) { 
                    const tempComments = Object.values(spot.comments) 
                    const tempRating = tempComments.reduce((a, b) => a + b.rating, 0) / tempComments.length 
                    return spot.rating = tempRating
                } else {
                    return spot.rating = 0
                }
            })

            setSpots(tempSpots) 
        })  
    }, []) 

    /**
     * Categories
     */
    const [categories, setCategories] = useState([
        {name: 'skatepark', active: true, id: 1, },
        {name: 'rail', active: true, id: 2, },
        {name: 'stairs', active: true, id: 3, },
        {name: 'flat', active: true, id: 4, },
        {name: 'ledge', active: true, id: 5, },
        {name: 'gap', active: true, id: 6, },
        {name: 'bank', active: true, id: 7, },
        {name: 'manual ledge', active: true, id: 8, },
        {name: 'other', active: true, id: 9, },
    ])

    /**
     * Sort by options
     */
    const [sortByOptions, setSortbyOptions] = useState([
        {value: 'newest', label: 'Od nejnovějšího', active: true, id: 1},
        {value: 'favorite', label: 'Nejoblíbenější', active: false, id: 2}, 
        // {value: 'closest', label: 'Nejbližší', active: false, id: 3}, 
    ])

    
    
    
    const [filteredSpots, setFilteredSpots] = useState([]) 
    let [finalSpots, setFinalSpots] = useState([...filteredSpots])
    const [selectedSpot, setSelectedSpot] = useState(null) 

    useEffect(() => {
        if (selectedSpot === null) {
            setMobilePanelSwitch(false)
        }
    }, [selectedSpot])


    /**
     * Mobile panel switch
     * if active, adds class to main wrapper map2 and moves the whole content so that on mobile you see details about spot or list of spots
     */
    const [mobilePanelSwitch, setMobilePanelSwitch] = useState(false)

    return (
        <div ref = {wrapperRef} className = {`${styles.map2} ${mobilePanelSwitch ? styles.mobileactive : ''}`} >


            <div className = {`${styles.left}`} >
                {selectedSpot &&
                    <SingleSpot 
                    selectedSpot = {selectedSpot} 
                    setSelectedSpot = {setSelectedSpot}
                    spots = {spots}
                    />
                }
                {!selectedSpot &&
                    <MapList 
                        spots = {spots}
                        finalSpots = {finalSpots} 
                        setFinalSpots = {setFinalSpots}
                        filteredSpots = {filteredSpots} 
                        setFilteredSpots = {setFilteredSpots}
                        categories = {categories}
                        setCategories = {setCategories} 
                        sortByOptions = {sortByOptions}
                        setSortbyOptions = {setSortbyOptions}
                        setSelectedSpot = {setSelectedSpot}
                        />
                }
            </div>

            <div className = {`${styles.right} `} >
                <Map 
                    spots = {spots}
                    selectedSkatepark = {selectedSpot}
                    setSelectedSkatepark = {setSelectedSpot} 
                    categories = {categories} 
                    filteredSkateparks = {filteredSpots} 
                    setMobilePanelSwitch = {setMobilePanelSwitch}
                />
            </div>
        </div>
    )
}

export default Map2