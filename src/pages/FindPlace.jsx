import { useEffect, useState, useMemo } from "react" 

import { db } from '../firebase'  
import { uuid } from 'uuid'  
import { set, ref, onValue, remove } from 'firebase/database' 

import { useRef } from "react" 
import Button from '../components/Button'
import DropdownMultiple from "../components/DropdownMultiple"

import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from "@react-google-maps/api"

import styles from './FindPlace.module.scss' 

import { Link, useLocation, useNavigate, useParams } from "react-router-dom"


import skateIcon from '../assets/skate_1.png' 
import flat from '../assets/flat.png' 
import gap from '../assets/gap.png' 
import ledge from '../assets/ledge.png' 
import rail from '../assets/rail.png' 
import stairs from '../assets/stairs.png' 
import bank from '../assets/bank.png' 
import other from '../assets/other.png'
import userlocation from '../assets/userlocation.png'
    




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

    // useEffect(() => {console.log(skateparks)}, [skateparks])

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
            itemRefs?.current[filteredSkateparks.indexOf(selectedSkatepark)]?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }

    }, [selectedSkatepark])
    // on load check params for active skatepark
    const navigate = useNavigate()
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const param = queryParams.get('spot')

        if (param && filteredSkateparks.length > 0) {
            const activeSkatepark = filteredSkateparks.find(skatepark => skatepark.uuid === param)
            const activeIndex = filteredSkateparks.indexOf(activeSkatepark)
            // navigate('/find-place', {replace: true, state: {activeIndex: activeIndex}}')
            
            navigate('/find-place')
            setSelectedSkatepark(activeSkatepark)
        }
    }, [location, filteredSkateparks])

    const [userLocation, setUserLocation] = useState(null)
    const mapRef = useRef(null) 
    const onMapLoad = (map) => {
        mapRef.current = map 

        mapRef.current?.setCenter({
            lat: 50.08949897498063,
            lng: 14.439616051195364, 
        }) 

        // set default location by user location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }) 
                mapRef.current?.setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            },
            (error) => {
                console.log(error)
            }
        )
    } 

    /**
     * pan and zoom to selected skatepark
     */
    const panTo = (lat, lng) => {
        mapRef.current?.setOptions({
            center: {lat: lat, lng: lng}, 
            zoom: 16,
        })
        mapRef.current?.panTo({lat: lat, lng: lng})
    }   

    // useEffect(() => {
        // console.log(selectedSkatepark)
    // }, [selectedSkatepark])

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

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
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

                <div className = {`${styles.skateparksWrapper} col-lg-4 col-12 order-lg-0 order-1 d-lg-flex d-none`}>
                    <div className = "ps-lg-4 pe-lg-4 ps-3 pe-3 w-100">
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
                                        {/* <p>ID spotu: <span className = "ps-auto">{skatepark.uuid}</span></p> */}
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
                
                <div className = {`${styles.mapWrapper} col-lg-8 col-12 p-lg-4 px-0`}>
                    {loading && (
                        <div>
                            <p className = "fs-1">Loading map...</p>
                        </div>
                    )} 

                    <div className = {`${styles.categories} my-3 p-lg-4 px-3 w-100`}>
                        <div className = "row flex-wrap px-lg-3">
                            <DropdownMultiple categories = {categories} setCategories = {setCategories} className = "col-md-4 col-sm-6 col-12" style = {{display: selectedSkatepark? 'none' : 'block'}} />

                            <Button variant = "rounded" className = "ms-auto col-sm-3 d-sm-block d-none" >
                                <Link to = "/add-place">Přidat spot</Link>
                            </Button>
                        </div>
                    </div>

                    {!isLoaded ?? <div>Loading map...</div>}
                    {isLoaded && (
                        <GoogleMap 
                            mapContainerClassName = {styles.map} 
                            onLoad = {onMapLoad} 
                            onClick={() => {setSelectedSkatepark(null); mapRef.current?.setZoom(13)}} 

                            options = {{
                                // set one finger gesture for mobile
                                gestureHandling: 'greedy', 
                                mapTypeId: 'satellite', 
                                clickableIcons: false, 
                                // center: userLocation ? {lat: userLocation.lat, lng: userLocation.lng} : {lat: 50.08949897498063, lng: 14.439616051195364}, 
                                // center: {lat: 50.08949897498063, lng: 14.439616051195364}, 
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
                                        {userLocation && 
                                        <MarkerF 
                                            position={userLocation} 
                                            icon={{
                                                url: userlocation,
                                                scaledSize: {width: 25, height: 25},
                                            }}    
                                        />}
                                    </div>
                                )
                            })}
                            {selectedSkatepark && (
                                <div>aa

                                <InfoWindowF 
                                    position = {{lat: selectedSkatepark.lat, lng: selectedSkatepark.lng}}
                                    onCloseClick={() => {setSelectedSkatepark(null); mapRef.current?.setZoom(13)}}  
                                    // pixelOffset = {window.google.maps.Size(100, -3000)} 
                                >
                                    <div>
                                        <h3 className = "py-2 fw-900 fs-3 montserrat text-center">{selectedSkatepark.name}</h3>
                                        <div className = "d-flex flex-wrap justify-content-center">
                                            <Link to = {`/${selectedSkatepark?.category === 'skatepark' ? 'skateparks' : 'spots'}/${selectedSkatepark?.uuid}`}>
                                                <Button variant = "primary" className = {`${styles.detailButton} mb-2 mx-2 fs-5 fw-800 mt-1 d-block  montserrat`}>Detail</Button>
                                            </Link>
                                            {/* <Link to = {`https://www.google.com/maps/@${selectedSkatepark.lat},${selectedSkatepark.lng},15z`} target = "_blank"> */}
                                            <Link to = {`https://www.google.com/maps/search/?api=1&query=${selectedSkatepark.lat}%2C${selectedSkatepark.lng}`} target = "_blank">
                                                <Button variant = "red" className = {`${styles.detailButton} mb-3 mx-2 fs-5 fw-800 mt-1 montserrat`}>Google Mapy</Button>
                                            </Link>
                                        </div>
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