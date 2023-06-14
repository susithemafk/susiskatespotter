
import styles from './List.module.scss'

import { useEffect, useState } from 'react'

import Button from '../../components/Button' 
import DropdownMultiple from '../../components/DropdownMultiple'
import DropdownSingle from '../../components/DropdownSingle'
import { Link } from 'react-router-dom'



const MapList = (props) => {
    const { 
        spots,
        finalSpots,
        setFinalSpots, 
        filteredSpots, 
        setFilteredSpots,
        categories, 
        setCategories, 
        sortByOptions, 
        setSortbyOptions, 
        setSelectedSpot, 
    } = props 

    const sortSpots = (temp) => {
        const activeValue = sortByOptions.find(option => option.active === true).value 

        if (activeValue === 'newest') {
            temp.sort((a, b) => {
                return b.createdate - a.createdate
            })
        }
        if (activeValue === 'favorite') {
            temp.sort((a, b) => {
                return b.rating - a.rating
            }) 
        } 

        // if (activeValue === 'closest') {
        //     temp.sort((a, b) => {
        //         return a.distance - b.distance
        //     })
        // }  
        return temp 
    } 

    /**
     * when categories change, filtered spots change
     */
    useEffect(() => {
        let temp = []
        if (spots) {
            spots.map(spot => {
                categories.map(category => {
                    if (spot.category === category.name && category.active === true) {
                        temp.push(spot)
                    }
                })
            }) 
        }

        // if all categories are inactive, then show all spots so its not empty, looks weird
        const allInactive = categories.every(item => item.active === false) 
        if (allInactive) temp = [...spots]
        setFilteredSpots(sortSpots(temp))

    }, [categories, spots, sortByOptions]) 

    /**
     * category vertical list on click remove filter
     */
    const handleActiveFilters = (itemId) => {
        setCategories((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, active: !item.active } : item
            )
        ) 
    } 
    const handleActiveFiltersAll = () => {
        setCategories((prevItems) =>
            prevItems.map((item) => {
                return { ...item, active: false }
            })
        )
    }  

    /**
     * filter by search 
     */
    const [searchTerm, setSearchTerm] = useState("")
    const [searchFilteredSpots, setSearchFilteredSpots] = useState([...filteredSpots])

    useEffect(() => {
        const searchedArray = filteredSpots.filter((spot) => {
            const regex = new RegExp(searchTerm, "gi") 
            return (
                // spot?.address.match(regex) ||
                spot?.name.match(regex) ||
                spot?.city.match(regex)
            )
        })
        setSearchFilteredSpots(searchedArray)   
    }, [searchTerm, filteredSpots])
    

    // last step before mapping, 
    // if searching, then map searchFilteredSpots, else map filteredSpots
    useEffect(() => {
        if (searchFilteredSpots.length < filteredSpots.length) setFinalSpots([...searchFilteredSpots])
        else                                                   setFinalSpots([...filteredSpots])

    }, [searchFilteredSpots, filteredSpots])

    // useEffect(() => {console.log(spots)}, [spots])
    
    
    useEffect(() => {window.scrollTo(0, 0)}, [])
    
    return (
        <div className = {`${styles.allPlaces} container-ml mx-auto`}>

            <label htmlFor = "search" className = {`${styles.search} row mx-auto align-items-center px-3 mt-5`}>
                <div className = {`${styles.searchIcon} me-3 py-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="35.997" height="36.004" viewBox="0 0 35.997 36.004"><path id="Icon_awesome-search" data-name="Icon awesome-search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"/></svg>
                </div>
                <input id = "search" className = {`${styles.searchInput}`} placeholder = "Vyhledej spot" type = "text" value = {searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </label>

            <div className = "d-flex flex-wrap mb-5 mt-4 px-4">
                <h1 className = "display-5 fw-800">Mapa spotů</h1>
                <Button variant = "rounded" className = "ms-auto d-block mt-auto">
                    <Link to = "/add-place">Přidat spot</Link>
                </Button>
            </div>

            <div className = {`${styles.filters} row flex-wrap h-100 my-3 px-4`}>

                <DropdownSingle values = {sortByOptions} setValues = {setSortbyOptions} className = " me-3 mb-3" />

                <DropdownMultiple categories = {categories} setCategories = {setCategories} className = " me-3 mb-3" />

            </div> 

            <div className = {`${styles.activeFilters} row flex-wrap align-items-center px-4 mb-`}>
                <span className = {styles.close} onClick = {handleActiveFiltersAll}>&#10006;</span> 
                <p className = "fw-600 ms-2 me-4 mb-0 my-3">filtry</p>
                {categories.map((category, index) => {
                    if (category.active === true) {
                        return (
                            <div className = {`${styles.activeFilter} mx-2 my-2 px-3 py-1`} onClick = {() => handleActiveFilters(category.id)} key = {index}>
                                <span className = "fw-600">{category.name}</span>
                                <span className = {`${styles.close} ms-2`}>&#10006;</span> 
                            </div>
                        )
                    }
                })}
            </div>

            <div className = {`${styles.boxes} row flex-wrap mb-5 pe-2`}>

                {finalSpots.map((spot, index) => {
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

                        {/* <div className = {`${styles.box}`} > */}
                        <div className = {`${styles.box}`} onClick = {() => setSelectedSpot(spot)}>

                            
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

            <section className = {`${styles.addSpot} text-center my-5 px-3`}>
                <h4 className = "fs-1 fw-800 mb-4">Chybí tu tvůj oblíbený spot?</h4>
                <Button variant = "primary" className = "d-block mx-auto mt-lg-0 mb-5 fs-4" >
                    <Link to = "/add-place">Přidej ho!</Link>
                </Button>
            </section>
        </div>
    )
}

export default MapList