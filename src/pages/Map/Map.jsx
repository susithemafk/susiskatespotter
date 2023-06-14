import styles from './Map.module.scss' 

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom' 
import { useLocation, useNavigate } from 'react-router-dom'
import { onValue, ref, set, push, remove } from 'firebase/database'
import { db } from '../../firebase'

import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import Button from '../../components/Button'
import DropdownMultiple from '../../components/DropdownMultiple'

import skateIcon from '../../assets/skate_1.png' 
import flat from '../../assets/flat.png' 
import gap from '../../assets/gap.png' 
import ledge from '../../assets/ledge.png' 
import rail from '../../assets/rail.png' 
import stairs from '../../assets/stairs.png' 
import bank from '../../assets/bank.png' 
import other from '../../assets/other.png'
import userlocation from '../../assets/userlocation.png'
    

const Map = (props) => {
    const {
        spots, 
        selectedSkatepark, 
        setSelectedSkatepark, 
        filteredSkateparks,
        categories, 
        setMobilePanelSwitch, 
    } = props


    const location = useLocation()
    const [loading, setLoading] = useState(true) 
    const [infoWindowOpen, setInfoWindowOpen] = useState(false) // this is just for the clicking anywhere on map to not zoom, only close window on click anywhere else


    /**
     * set active/selected spot
     */
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
    useEffect(() => {setLoading(!isLoaded)}, [isLoaded])
    
    return (
        <div className = {`${styles.mapWrapper}`}>
            {loading && (
                <div>
                    <p className = "fs-1">Loading map...</p>
                </div>
            )} 

            {!isLoaded ?? <div>Loading map...</div>}
            {isLoaded && (
                <GoogleMap 
                    mapContainerClassName = {styles.map} 
                    onLoad = {onMapLoad} 
                    onClick={() => setSelectedSkatepark(null)} 

                    options = {{
                        // set one finger gesture for mobile
                        gestureHandling: 'greedy', 
                        // mapTypeId: 'satellite', 
                        clickableIcons: false, 
                        // center: userLocation ? {lat: userLocation.lat, lng: userLocation.lng} : {lat: 50.08949897498063, lng: 14.439616051195364}, 
                        // center: {lat: 50.08949897498063, lng: 14.439616051195364}, 
                        zoom: 13, 
                        minZoom: 8, 
                        // maxZoom: 18, 
                            

                    }}
                >

                    <div className = {`${styles.allSpots} mt-sm-5 pt-3 mx-3`}>
                        <Button variant = "primary" onClick = {() => setMobilePanelSwitch(true)}>všechny spoty</Button>
                    </div>
                    
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
                        <InfoWindowF 
                            position = {{lat: selectedSkatepark.lat, lng: selectedSkatepark.lng}}
                            onCloseClick={() => {setSelectedSkatepark(null); mapRef.current?.setZoom(13)}}  
                            // pixelOffset = {window.google.maps.Size(100, -3000)} 
                        >
                            <div className = {`${styles.infowindow}`}>
                                <img src = {selectedSkatepark.images[0]} alt = {selectedSkatepark.name} />
                                <div className = {styles.textWrapper}>
                                    <h3 className = {styles.text}>{selectedSkatepark.name}</h3>
                                </div>
                                <div className = {styles.buttonWrapper}>
                                    <Button variant = "primary" onClick = {() => setMobilePanelSwitch(true)}>
                                        detail
                                    </Button>
                                </div>
                            </div>
                        </InfoWindowF> 
                    )}
                    </div>
                </GoogleMap>
            )}

        </div>
    )
}

export default Map