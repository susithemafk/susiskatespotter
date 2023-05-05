
import { useState } from 'react'
import styles from './ChooseVertical.module.scss'

const ChooseVertical = ({categories, setCategories}) => {

    const handleActive = (itemId) => {
        setCategories((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, active: !item.active } : item
            )
        )
    } 


    return (
        <div className = {styles.chooseVertical}>
            <div className = {`${styles.r} row flex-wrap justify-content-center`}>

                {categories?.map((category, index) => {
                    return (
                        <button className = {`${styles.box} ${category.active ? styles.active : ''} mx-2 px-4 py-2 my-2`} onClick = {() => handleActive(category.id)} style = {{backgroundColor: category.active ? category.border : category.bg, borderColor: category.border}} key = {index}>
                            <p className = "m-0 fw-600">{category.name}</p>
                        </button>
                    )
                })}

            </div>
        </div>
    )
}

export default ChooseVertical