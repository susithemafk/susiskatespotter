import skateIcon from '../assets/skate_1.png' 
import flat from '../assets/flat.png' 
import gap from '../assets/gap.png' 
import ledge from '../assets/ledge.png' 
import rail from '../assets/rail.png' 
import stairs from '../assets/stairs.png' 
import bank from '../assets/bank.png' 
import other from '../assets/other.png'
import userlocation from '../assets/userlocation.png' 

import styles from './Map.module.scss'

import { useEffect, useState, useMemo } from "react" 

import { db } from '../firebase'  
import { uuid } from 'uuid'  
import { set, ref, onValue, remove } from 'firebase/database' 

import { useRef } from "react" 

import Button from '../components/Button'
import DropdownMultiple from "../components/DropdownMultiple"

import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from "@react-google-maps/api"


import { Link, useLocation, useNavigate, useParams, useNavigation } from "react-router-dom"



const Map = ({ skateparks, selectedSkatepark, setSelectedSkatepark }) => {
    const location = useLocation()
    const [userLocation, setUserLocation] = useState(null)
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

    // map loaded
    const { isLoaded, loadError } = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, }) 

    // on map load function
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
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }

                // setUserLocation(userLocation)
                // mapRef.current?.setCenter(userLocation)
            },
            (error) => {console.log(error)}
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
    // onClick on skatepark
    useEffect(() => {
        if (selectedSkatepark?.lat && selectedSkatepark?.lng) {
            panTo(selectedSkatepark?.lat - 0.002, selectedSkatepark?.lng)

            // scrolls in list to selected skatepark
            // itemRefs?.current[filteredSkateparks.indexOf(selectedSkatepark)]?.scrollIntoView({
            //     behavior: "smooth",
            //     block: "center"
            // })
        }

    }, [selectedSkatepark])

    /**
     * handle categories 
     */
    const [filteredSkateparks, setFilteredSkateparks] = useState([...skateparks])
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
    
    
    return (
        <div className = {styles.mapWrapper}>
            <div className = {`${styles.categories} my-3 px-3 w-100`} style = {{display: selectedSkatepark? 'none' : 'block'}}>
                <div className = "row flex-wrap px-lg-3">
                    <DropdownMultiple categories = {categories} setCategories = {setCategories} className = "col-md-4 col-sm-6 col-12" />

                    <Button variant = "rounded" className = "ms-auto col-sm-3 d-sm-block d-none" >
                        <Link to = "/add-place">Přidat spot</Link>
                    </Button>
                </div>
            </div>

            {!isLoaded ?? <div>Loading map...</div>}
            {isLoaded && (
                <GoogleMap 
                    id = {styles.map}
                    mapContainerClassName = {styles.map} 
                    onLoad = {onMapLoad} 
                    // onClick={() => {setSelectedSkatepark(null); mapRef.current?.setZoom(13)}} 
                    onClick={() => {setSelectedSkatepark(null)}} 

                    options = {{
                        // set one finger gesture for mobile
                        gestureHandling: 'greedy', 
                        // mapTypeId: 'satellite', 
                        clickableIcons: false, 
                        zoom: 13, 
                        minZoom: 8, 
                    }}
                >
                    
                    <div>
                    {/* {skateparks.map((skatepark, index) => { */}
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
                            onCloseClick={() => {setSelectedSkatepark(null)}}  
                        >
                            {/* <div>
                                <h3 className = "py-2 fw-900 fs-3 montserrat text-center">{selectedSkatepark.name}</h3>
                                <div className = "d-flex flex-wrap justify-content-center">
                                    <Link to = {`/${selectedSkatepark?.category === 'skatepark' ? 'skateparks' : 'spots'}/${selectedSkatepark?.uuid}`}>
                                        <Button variant = "primary" className = {`${styles.detailButton} mb-2 mx-2 fs-5 fw-800 mt-1 d-block  montserrat`}>Detail</Button>
                                    </Link>
                                    <Link to = {`https://www.google.com/maps/search/?api=1&query=${selectedSkatepark.lat}%2C${selectedSkatepark.lng}`} target = "_blank">
                                        <Button variant = "red" className = {`${styles.detailButton} mb-3 mx-2 fs-5 fw-800 mt-1 montserrat`}>Google Mapy</Button>
                                    </Link>
                                </div>
                            </div> */}
                            <div className = {styles.infoWindow}>
                                <div className = {styles.overlay}></div>
                                <img src = {selectedSkatepark?.images[0]} alt = "" /> 
                                <h3 className = {`${styles.title} text-light fs-3 p-3 montserrat`}>{selectedSkatepark.name}</h3>
                            </div>
                        </InfoWindowF> 
                        
                        </div>
                    )}
                    </div>
                </GoogleMap>
                )}
        </div>

    )
}

export default Map