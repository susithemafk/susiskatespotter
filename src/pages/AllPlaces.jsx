import styles from "./AllPlaces.module.scss"
import { useState, useEffect, useRef } from "react" 
import Button from '../components/Button' 
import { Link } from "react-router-dom"
import DropdownMultiple from "../components/DropdownMultiple" 
import { db } from "../firebase" 
import { ref, onValue } from "firebase/database" 

import { useLocation } from 'react-router-dom';
import Select from 'react-select'
import DropdownSingle from "../components/DropdownSingle"

const AllPlaces = () => {

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

    const location = useLocation()

    /**
     * Loads skateparks from database
     */ 
    const [skateparks, setSkateparks] = useState([])
    useEffect(() => {
        let tempSkatespots = []
        onValue(ref(db), (snapshot) => {
            const data = snapshot.val()
            if (data !== null) {
                tempSkatespots = [...tempSkatespots, ...Object.values(data.skateparks)]
                tempSkatespots = [...tempSkatespots, ...Object.values(data.spots)]
            } 

            // add calculated rating to skateparks - skatepark.rating = 0 - 100
            tempSkatespots.map(spot => {
                if (spot.comments) { 
                    const tempComments = Object.values(spot.comments) 
                    const tempRating = tempComments.reduce((a, b) => a + b.rating, 0) / tempComments.length 
                    return spot.rating = tempRating
                } else {
                    return spot.rating = 0
                }
            })

            setSkateparks(tempSkatespots) 
        })  
    }, []) 

    /**
     * if has params in url, set active category
     */
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const paramCategory = queryParams.get('category')
        const tempCategories = [...categories]

        // if has paramCategory, then set it to it
        if (paramCategory) {
            tempCategories.map(category => {
                if (category.name === paramCategory) {
                    category.active = true
                } else {
                    category.active = false
                }
            })
        }
        // if param === spots, set spots to active, skateparks to inactive
        if (paramCategory === 'spots') {
            tempCategories.map((category) => {
                if (category.name === 'skatepark') {
                    category.active = false
                } else {
                    category.active = true
                }
            })
        }
        setCategories(tempCategories)

    }, [location]) 

    /**
     * sort by
     */
    const [sortByOptions, setSortbyOptions] = useState([
        {value: 'newest', label: 'Od nejnovějšího', active: true, id: 1},
        {value: 'favorite', label: 'Nejoblíbenější', active: false, id: 2}, 
        // {value: 'closest', label: 'Nejbližší', active: false, id: 3}, 
    ])
    
    const sortSkateparks = (temp) => {
        const activeValue = sortByOptions.find(option => option.active === true).value 

        // console.log('temp')
        // console.log(temp)
        
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

        // console.log('temp')
        // console.log(temp)

        // if (activeValue === 'closest') {
        //     temp.sort((a, b) => {
        //         return a.distance - b.distance
        //     })
        // }  
        return temp 
    } 

    /**
     * when categories change, filtered skateparks change
     */
    const [filteredSkateparks, setFilteredSkateparks] = useState([]) 

    useEffect(() => {
        let temp = []
        skateparks.map(skatepark => {
            categories.map(category => {
                if (skatepark.category === category.name && category.active === true) {
                    temp.push(skatepark)
                }
            })
        }) 

        // if all categories are inactive, then show all skateparks so its not empty, looks weird
        const allInactive = categories.every(item => item.active === false) 
        if (allInactive) temp = [...skateparks]
        setFilteredSkateparks(sortSkateparks(temp))

    }, [categories, skateparks, sortByOptions]) 

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
    const [searchFilteredSkateparks, setSearchFilteredSkateparks] = useState([...filteredSkateparks])

    useEffect(() => {
        const searchedArray = filteredSkateparks.filter((skatepark) => {
            const regex = new RegExp(searchTerm, "gi") 
            return (
                // skatepark?.address.match(regex) ||
                skatepark?.name.match(regex) ||
                skatepark?.city.match(regex)
            )
        })
        setSearchFilteredSkateparks(searchedArray)   
    }, [searchTerm, filteredSkateparks])
    


    // useEffect(() => {console.log(skateparks);}, [skateparks])
    // useEffect(() => {console.log(filteredSkateparks);}, [filteredSkateparks])
    // useEffect(() => {console.log(categories);}, [categories])
    

    // last step before mapping, 
    // if searching, then map searchFilteredSkateparks, else map filteredSkateparks
    let [mapSkateparks, setMapSkateparks] = useState([...filteredSkateparks])

    useEffect(() => {
        if (searchFilteredSkateparks.length < filteredSkateparks.length) setMapSkateparks([...searchFilteredSkateparks])
        else                                                             setMapSkateparks([...filteredSkateparks])

    }, [searchFilteredSkateparks, filteredSkateparks])

    return (
        <div className = {`${styles.allPlaces} container-ml mx-auto pt-5`}>

            <label htmlFor = "search" className = {`${styles.search} row mx-auto align-items-center px-4`}>
                <div className = {`${styles.searchIcon} me-3 py-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="35.997" height="36.004" viewBox="0 0 35.997 36.004"><path id="Icon_awesome-search" data-name="Icon awesome-search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"/></svg>
                </div>
                <input id = "search" className = {`${styles.searchInput}`} placeholder = "Vyhledej spot" type = "text" value = {searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </label>

            <h1 className = "display-5 px-4 fw-800 my-5">Objev nové spoty</h1>

            <div className = {`${styles.filters} row flex-wrap my-3 px-4`}>

                <DropdownSingle values = {sortByOptions} setValues = {setSortbyOptions} className = "pe-md-3 mb-0 mb-md-0 col-lg-4 mb-3 col-md-6 col-12" />

                <DropdownMultiple categories = {categories} setCategories = {setCategories} className = " col-lg-4 mb-0 mb-md-0 col-md-6 col-12" />

                <Button variant = "rounded" className = "ms-auto d-block mt-lg-0 mt-4" >
                    <Link to = "/add-place">Přidat spot</Link>
                </Button>

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

            <div className = {`${styles.boxes} row flex-wrap mb-5`}>

                {mapSkateparks.map((skatepark, index) => {
                    const bgColor = () => {
                        if (skatepark.category === 'skatepark') return '#00D10E' 
                        else if (skatepark.category === 'rail') return '#1fdaa7' 
                        else if (skatepark.category === 'stairs') return '#FFC107' 
                        else if (skatepark.category === 'flat') return '#dc88ff' 
                        else if (skatepark.category === 'ledge') return '#009FD1' 
                        else if (skatepark.category === 'gap') return '#002AD1' 
                        else if (skatepark.category === 'bank') return '#5300D1' 
                        else if (skatepark.category === 'other') return '#D10069' 
                        else return '#00D10E' 
                    }
                    return (
                    <div className = {`${styles.boxWrapper} col-lg-4 col-sm-6 col-12 p-sm-4 p-4`} key = {index}>

                        <Link to = {`/${skatepark?.category === 'skatepark' ? 'skateparks' : 'spots'}/${skatepark?.uuid}`}>
                        <div className = {`${styles.box}`}>

                            
                            <div className = {`${styles.header}`}>
                                <img src = {skatepark.images[0]} alt = ""></img>
                                <div className = {`${styles.overlay}`}></div>

                                <div className = {`${styles.categoryLabel} row`} style = {{backgroundColor: bgColor()}}>
                                    
                                    <div className = {`${styles.icon}`}>
                                        <svg id="Group_18" data-name="Group 18" xmlns="http://www.w3.org/2000/svg" width="12.164" height="12.163" viewBox="0 0 12.164 12.163">
                                            <path id="Icon_material-crop-square" data-name="Icon material-crop-square" d="M10.922,6H6.7a.705.705,0,0,0-.7.7v4.219a.705.705,0,0,0,.7.7h4.219a.705.705,0,0,0,.7-.7V6.7A.705.705,0,0,0,10.922,6Zm0,4.922H6.7V6.7h4.219Z" transform="translate(-6 -6)" fill="#fff"/>
                                            <path id="Icon_material-crop-square-2" data-name="Icon material-crop-square" d="M10.922,6H6.7a.705.705,0,0,0-.7.7v4.219a.705.705,0,0,0,.7.7h4.219a.705.705,0,0,0,.7-.7V6.7A.705.705,0,0,0,10.922,6Zm0,4.922H6.7V6.7h4.219Z" transform="translate(0.538 -6)" fill="#fff"/>
                                            <path id="Icon_material-crop-square-3" data-name="Icon material-crop-square" d="M10.922,6H6.7a.705.705,0,0,0-.7.7v4.219a.705.705,0,0,0,.7.7h4.219a.705.705,0,0,0,.7-.7V6.7A.705.705,0,0,0,10.922,6Zm0,4.922H6.7V6.7h4.219Z" transform="translate(-6 0.538)" fill="#fff"/>
                                            <path id="Icon_material-crop-square-4" data-name="Icon material-crop-square" d="M10.922,6H6.7a.705.705,0,0,0-.7.7v4.219a.705.705,0,0,0,.7.7h4.219a.705.705,0,0,0,.7-.7V6.7A.705.705,0,0,0,10.922,6Zm0,4.922H6.7V6.7h4.219Z" transform="translate(0.538 0.538)" fill="#fff"/>
                                        </svg>
                                    </div>
                                    <p>{skatepark.category}</p>

                                </div>

                            </div>
                            
                            <div className = {`${styles.content}`}>
                                <h3 className = {`${styles.title} mt-4`}>{skatepark.name}</h3>
                                <div className = {`${styles.details} row flex-wrap py-3`}>
                                    <div className = {`${styles.titles} col-6 ps-2 pe-3 py-3`}>
                                        <p>Kategorie</p>
                                        <p>Město</p>
                                        <p>Hodnocení</p>
                                    </div>
                                    <div className = {`${styles.values} col-6 ps-3 pe-2 py-3`}>
                                        <p>Bank</p>
                                        <p>{skatepark.city}</p>
                                        <p>{skatepark.rating ? Math.round(skatepark.rating / 20 * 100) / 100 + ' / 5' : 'nehodnoceno'}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        </Link>
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


export default AllPlaces 