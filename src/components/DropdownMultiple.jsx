import styles from './DropdownMultiple.module.scss' 
import { useState, useEffect } from 'react'

const DropdownMultiple = ({ categories, setCategories, className }) => {

    
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(!open)
    } 

    const [allActive, setAllActive] = useState(false) 
    useEffect(() => {
        const active = categories.every((item) => item.active === true)
        setAllActive(active)
    }, [categories])

    const handleActive = (itemId) => {
        // handleAll
        if (itemId === 0) {
            setCategories((prevItems) => {
                const newItems = prevItems.map((item) => {
                    const every = prevItems.every((item) => item.active === true)
                    if (every) {
                        return { ...item, active: false }
                    } else {
                        return { ...item, active: true }
                    }
                })
                return newItems
            })
        // handleSingle
        } else {
            setCategories((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId ? { ...item, active: !item.active } : item
                )
            )
        }
    } 
    
    return (
        <div className = {`${styles.dropdown} ${className}`}>

            <div className = {`${styles.clickOutside} ${open ? 'd-block' : 'd-none'}`} onClick = {handleOpen}></div>

            <div className = {`${styles.container} h-100`}>
                <div className = {`${styles.selectButton} px-4 h-100 d-flex align-items-center`} onClick = {handleOpen}>
                    <span className = {styles.icon}>
                        <svg id="Group_18" data-name="Group 18" xmlns="http://www.w3.org/2000/svg" width="12.164" height="12.163" viewBox="0 0 12.164 12.163"><path id="Icon_material-crop-square" data-name="Icon material-crop-square" d="M10.922,6H6.7a.705.705,0,0,0-.7.7v4.219a.705.705,0,0,0,.7.7h4.219a.705.705,0,0,0,.7-.7V6.7A.705.705,0,0,0,10.922,6Zm0,4.922H6.7V6.7h4.219Z" transform="translate(-6 -6)" fill="#000"/><path id="Icon_material-crop-square-2" data-name="Icon material-crop-square" d="M10.922,6H6.7a.705.705,0,0,0-.7.7v4.219a.705.705,0,0,0,.7.7h4.219a.705.705,0,0,0,.7-.7V6.7A.705.705,0,0,0,10.922,6Zm0,4.922H6.7V6.7h4.219Z" transform="translate(0.538 -6)" fill="#000"/><path id="Icon_material-crop-square-3" data-name="Icon material-crop-square" d="M10.922,6H6.7a.705.705,0,0,0-.7.7v4.219a.705.705,0,0,0,.7.7h4.219a.705.705,0,0,0,.7-.7V6.7A.705.705,0,0,0,10.922,6Zm0,4.922H6.7V6.7h4.219Z" transform="translate(-6 0.538)" fill="#000"/><path id="Icon_material-crop-square-4" data-name="Icon material-crop-square" d="M10.922,6H6.7a.705.705,0,0,0-.7.7v4.219a.705.705,0,0,0,.7.7h4.219a.705.705,0,0,0,.7-.7V6.7A.705.705,0,0,0,10.922,6Zm0,4.922H6.7V6.7h4.219Z" transform="translate(0.538 0.538)" fill="#000"/></svg>
                    </span>
                    <h4 className = "fw-500 ms-3">Kategorie</h4>
                    <span className = "ms-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29.764" height="12.64" viewBox="0 0 29.764 12.64"><path id="Path_1" data-name="Path 1" d="M3308.262,598.979l12.8,8.739,12.8-8.739" transform="translate(-3306.177 -596.895)" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="3"/></svg>
                    </span>
                </div>

                <ul className = {`${styles.options} ${open ? 'd-block' : 'd-none'} mt-3`}>
                            <li className = {`${styles.option} d-flex py-3 px-3 align-items-center`} onClick = {() => handleActive(0)}>
                                <span className = {`${styles.checkbox} me-3`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" data-name="Layer 2" viewBox="0 0 126.25 126.25">
                                        <g id="Vrstva_1" data-name="Vrstva 1">
                                            <g>
                                            <path d="m0,63.04C0,49.28,0,35.53,0,21.78,0,9.12,9.1,0,21.74,0c27.61,0,55.23,0,82.84,0,12.52,0,21.65,9.16,21.66,21.7,0,27.61,0,55.23,0,82.84,0,12.52-9.15,21.69-21.66,21.7-27.67.01-55.34.01-83.01,0C9.17,126.23.01,117.04,0,104.62c0-13.86,0-27.72,0-41.59Zm62.96,49.16c13.7,0,27.39,0,41.09,0,5.53,0,8.14-2.61,8.14-8.14,0-27.28,0-54.57,0-81.85,0-5.53-2.61-8.14-8.14-8.14-27.28,0-54.57,0-81.85,0-5.54,0-8.14,2.6-8.14,8.14,0,27.28,0,54.57,0,81.85,0,5.53,2.61,8.14,8.14,8.14,13.59,0,27.18,0,40.76,0Z"/>
                                            {allActive ? <path d="m56.2,67.35c1.77-1.84,3.37-3.55,5.03-5.22,5.95-5.97,11.89-11.96,17.9-17.88,3.93-3.87,10.21-2.32,11.72,2.85.83,2.83,0,5.26-2.08,7.33-5.44,5.4-10.85,10.84-16.27,16.26-3.68,3.68-7.35,7.37-11.04,11.03-3.33,3.3-7.37,3.3-10.72-.02-4.43-4.4-8.84-8.81-13.24-13.24-3.06-3.08-3.21-7.4-.39-10.26,2.82-2.85,7.18-2.74,10.26.3,2.88,2.84,5.72,5.73,8.83,8.86Z"/> : ''}
                                            </g>
                                        </g>
                                    </svg>
                                </span> 
                                <p className = "m-0 fw-500">zobrazit vše</p>
                            </li>
                    {categories?.map((category, index) => {
                        return (
                            <li className = {`${styles.option} d-flex py-3 px-3 align-items-center`} key = {index} onClick = {() => handleActive(category.id)}>
                                <span className = {`${styles.checkbox} me-3`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" data-name="Layer 2" viewBox="0 0 126.25 126.25">
                                        <g id="Vrstva_1" data-name="Vrstva 1">
                                            <g>
                                            <path d="m0,63.04C0,49.28,0,35.53,0,21.78,0,9.12,9.1,0,21.74,0c27.61,0,55.23,0,82.84,0,12.52,0,21.65,9.16,21.66,21.7,0,27.61,0,55.23,0,82.84,0,12.52-9.15,21.69-21.66,21.7-27.67.01-55.34.01-83.01,0C9.17,126.23.01,117.04,0,104.62c0-13.86,0-27.72,0-41.59Zm62.96,49.16c13.7,0,27.39,0,41.09,0,5.53,0,8.14-2.61,8.14-8.14,0-27.28,0-54.57,0-81.85,0-5.53-2.61-8.14-8.14-8.14-27.28,0-54.57,0-81.85,0-5.54,0-8.14,2.6-8.14,8.14,0,27.28,0,54.57,0,81.85,0,5.53,2.61,8.14,8.14,8.14,13.59,0,27.18,0,40.76,0Z"/>
                                            {category.active? <path d="m56.2,67.35c1.77-1.84,3.37-3.55,5.03-5.22,5.95-5.97,11.89-11.96,17.9-17.88,3.93-3.87,10.21-2.32,11.72,2.85.83,2.83,0,5.26-2.08,7.33-5.44,5.4-10.85,10.84-16.27,16.26-3.68,3.68-7.35,7.37-11.04,11.03-3.33,3.3-7.37,3.3-10.72-.02-4.43-4.4-8.84-8.81-13.24-13.24-3.06-3.08-3.21-7.4-.39-10.26,2.82-2.85,7.18-2.74,10.26.3,2.88,2.84,5.72,5.73,8.83,8.86Z"/> : ''}
                                            </g>
                                        </g>
                                    </svg>
                                </span> 
                                <p className = "m-0 fw-500">{category.name}</p>
                            </li>
                        )
                    })}
                </ul>

            </div>


        </div>
    )
}

export default DropdownMultiple