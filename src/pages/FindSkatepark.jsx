import { useEffect, useState, useMemo } from "react" 

import { db } from '../firebase'  
import { uid } from 'uid'  
import { set, ref, onValue, remove } from 'firebase/database' 

import { useRef } from "react" 
import Button from '../components/Button'
import DropdownMultiple from "../components/DropdownMultiple"

import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from "@react-google-maps/api"

import styles from './FindSkatepark.module.scss' 

import { Link, useLocation } from "react-router-dom"


import skateIcon from '../assets/skate_1.png' 
import flat from '../assets/flat.png' 
import gap from '../assets/gap.png' 
import ledge from '../assets/ledge.png' 
import rail from '../assets/rail.png' 
import ramp from '../assets/ramp.png' 
import stairs from '../assets/stairs.png' 
import bank from '../assets/bank.png' 
import other from '../assets/other.png'
    




const FindSkatepark = () => {
    const location = useLocation()
    const [skateparks, setSkateparks] = useState([]) 
    const [filteredSkateparks, setFilteredSkateparks] = useState([])
    const [loading, setLoading] = useState(true) 
    const [infoWindowOpen, setInfoWindowOpen] = useState(false) // this is just for the clicking anywhere on map to not zoom, only close window on click anywhere else
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

    useEffect(() => {console.log(skateparks)}, [skateparks])

    /**
     * set active/selected spot
     */
    const [selectedSkatepark, setSelectedSkatepark] = useState(null) 
    const itemRefs = useRef([])

    // onClick on skatepark
    useEffect(() => {
        if (selectedSkatepark?.lat && selectedSkatepark?.lng) {
            panTo(selectedSkatepark?.lat, selectedSkatepark?.lng)

            // scrolls in list to selected skatepark
            itemRefs.current[filteredSkateparks.indexOf(selectedSkatepark)]?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }

    }, [selectedSkatepark])
    // on load check params for active skatepark
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const param = queryParams.get('spot')
        console.log(param)
        console.log(filteredSkateparks) 

        if (param && filteredSkateparks.length > 0) {
            const activeSkatepark = filteredSkateparks.find(skatepark => skatepark.uuid === param)
            const activeIndex = filteredSkateparks.indexOf(activeSkatepark)

            setSelectedSkatepark(activeSkatepark)
        }
    }, [location, filteredSkateparks])

    const mapRef = useRef(null) 
    const onMapLoad = (map) => {mapRef.current = map}
    const panTo = (lat, lng) => {
        mapRef.current?.panTo({lat, lng})
        mapRef.current?.setZoom(16) 
        // mapRef.current.setCenter({lat, lng})
    }   

    useEffect(() => {
        console.log(selectedSkatepark)
    }, [selectedSkatepark])

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

    const { isLoaded } = useLoadScript({
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        googleMapsApiKey: 'AIzaSyAY8fTYH0eI9X0PUFuMJh3bMY40XH65fMU',
    }) 

    /**
     * sets height of wrapper for safari, then set up in scss by %
     */
    const wrapperRef = useRef(null)
    const setHeightsForSafari = () => {
        const pageHeight = window.innerHeight - 85 // - header height

        if (wrapperRef.current) {
            wrapperRef.current.style.height = `${pageHeight}px`
        }
    } 
    useEffect(() => {
        setHeightsForSafari()
    }, [])

    /**
     * handle categories 
     */
    useEffect(() => {
        let temp = []
        skateparks.map(skatepark => {
            categories.map(category => {
                if (skatepark.category === category.name && category.active === true) {
                    temp.push(skatepark)
                }
            })
        }) 
        const allInactive = categories.every(item => item.active === false) 
        if (allInactive) temp = [...skateparks]

        setFilteredSkateparks(temp)
    }, [categories, skateparks])

    
    
    return (
        <div className = {`${styles.findSkatepark}`}>

            <div ref = {wrapperRef} className = {`${styles.wrapper} row flex-lg-nowrap flex-wrap`}>

                <div className = {`${styles.skateparksWrapper} col-lg-4 col-12 order-lg-0 order-1`}>
                    <div className = "ps-lg-4 pe-lg-0 ps-3 pe-3">
                    {loading && (
                        <div>
                            <p className = "fs-1">Loading...</p>
                        </div>
                    )}

                    {!loading && filteredSkateparks.map((skatepark, index) => {

                        return (
                            <div 
                                key = {index} 
                                ref={el => itemRefs.current[index] = el} 
                                className = {`${styles.skatepark} ${skatepark === selectedSkatepark ? styles.active : ''} mb-4`} 
                                onClick = {() => setSelectedSkatepark(skatepark)}
                                >
                                <img src = {skatepark.images[0]} alt = {skatepark.name} className = {styles.skateparkBackground} />
                                <div className = {styles.skateparkOverlay}></div>

                                <div className = {`${styles.content} p-3`}>
                                    <h2 className = "fs-2">{skatepark.name}</h2>
                                    <div className = {`${styles.details}`}>
                                        <p>ID spotu: <span className = "ps-auto">{skatepark.uuid}</span></p>
                                        <p>Adresa: {skatepark.address}</p>
                                        <p>Město: {skatepark.city}</p>
                                        <div style = {{cursor: 'pointer'}}>
                                            {copied ? <p>Copied to clipboard</p> : <p onClick = {() => copyValue(skatepark.lat, skatepark.lng)}>{skatepark.lat}, {skatepark.lng}</p>}
                                        </div>
                                    </div>
                                </div> 

                                <Link to = {`/${selectedSkatepark?.category === 'skatepark' ? 'skateparks' : 'spots'}/${selectedSkatepark?.uuid}`}>
                                    <Button variant = "primary" className = {`${styles.detailButton} m-3`}>Detail</Button>
                                </Link>
                            </div>
                        )

                    })}
                    </div>

                </div>
                
                <div className = {`${styles.mapWrapper} col-lg-8 col-12 p-lg-4 px-3`}>
                    {loading && (
                        <div>
                            <p className = "fs-1">Loading map...</p>
                        </div>
                    )} 

                    <div className = {`${styles.categories} my-3 p-lg-4 px-3 w-100`}>
                        <div className = "row flex-wrap px-3">
                            <DropdownMultiple categories = {categories} setCategories = {setCategories} className = "col-md-4 col-sm-6 col-12" />

                            <Button variant = "rounded" className = "ms-auto col-sm-3 d-sm-block d-none" >
                                <Link to = "/add-skatepark">Přidat spot</Link>
                            </Button>
                        </div>
                    </div>

                    {!isLoaded ?? <div>Loading map...</div>}
                    {isLoaded && (
                        <GoogleMap 
                            mapContainerClassName = {styles.map} 
                            onLoad = {onMapLoad} 
                            onClick={() => {setSelectedSkatepark(null); mapRef.current.setZoom(13)}} 

                            options = {{
                                // set one finger gesture for mobile
                                gestureHandling: 'greedy', 
                                mapTypeId: 'satellite', 
                                clickableIcons: false, 
                                center: {lat: 50.08949897498063, lng: 14.439616051195364}, 
                                zoom: 13, 
                                minZoom: 8, 
                                // maxZoom: 18, 

                            }}
                        >
                            
                            <div>
                            {filteredSkateparks.map((skatepark, index) => {
                                const customMarker = () => {
                                    if (skatepark.category === 'skatepark') return skateIcon 
                                    else if (skatepark.category === 'rail') return rail 
                                    else if (skatepark.category === 'stairs') return stairs 
                                    else if (skatepark.category === 'flat') return flat 
                                    else if (skatepark.category === 'ledge') return ledge 
                                    else if (skatepark.category === 'gap') return gap 
                                    else if (skatepark.category === 'bank') return  bank
                                    else if (skatepark.category === 'other') return other 
                                    else return skateIcon 
                                } 

                                return (
                                    <div key = {skatepark.uuid} className = {styles.marker}>
                                        <MarkerF 
                                            position = {{lat: skatepark.lat, lng: skatepark.lng}}
                                            onClick = {() => setSelectedSkatepark(skatepark)} 
                                            icon={{
                                                url: customMarker(), 
                                                scaledSize: {width: 50, height: 50}, 
                                            }} 
                                            animation={
                                                skatepark === selectedSkatepark && selectedSkatepark !== null
                                                ?  window.google.maps.Animation.BOUNCE
                                                  : window.google.maps.Animation.DROP
                                            }
                                        >
                                        </MarkerF>
                                    </div>
                                )
                            })}
                            {selectedSkatepark && (
                                <div>aa

                                <InfoWindowF 
                                    position = {{lat: selectedSkatepark.lat, lng: selectedSkatepark.lng}}
                                    onCloseClick={() => {setSelectedSkatepark(null); mapRef.current.setZoom(13)}}  
                                    // pixelOffset = {window.google.maps.Size(100, -3000)} 
                                >
                                    <div>
                                        <h3 className = "px-4 py-2 fw-900 fs-3 montserrat">{selectedSkatepark.name}</h3>
                                        <Link to = {`/${selectedSkatepark?.category === 'skatepark' ? 'skateparks' : 'spots'}/${selectedSkatepark?.uuid}`}>
                                            <Button variant = "primary" className = {`${styles.detailButton} mb-3 mt-1 mx-auto d-block`}>Detail</Button>
                                        </Link>
                                    </div>
                                </InfoWindowF> 
                                
                                </div>
                            )}
                            </div>
                        </GoogleMap>
                    )}

                </div>

            </div>
        </div>

    )
}

export default FindSkatepark