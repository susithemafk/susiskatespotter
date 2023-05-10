import styles from './LogoSlider.module.scss'

import brno_logo from '../assets/cities/brno_logo.svg'
import cb_logo from '../assets/cities/cb_logo.svg'
import liberec_logo from '../assets/cities/liberec_logo.svg'
import olomouc_logo from '../assets/cities/olomouc_logo.svg'
import ostrava_logo from '../assets/cities/ostrava_logo.svg' 
import plzen_logo from '../assets/cities/plzen_logo.svg'
import praha_logo from '../assets/cities/praha_logo.svg'
import { useEffect, useState } from 'react'


const LogoSlider = ({ animationTime, maxHeight }) => {

    const logos = [
        {id: 1, name: 'brno', image: brno_logo},
        {id: 2, name: 'ceske_budejovice', image: cb_logo},
        {id: 3, name: 'liberec', image: liberec_logo}, 
        {id: 4, name: 'olomouc', image: olomouc_logo},
        {id: 5, name: 'ostrava', image: ostrava_logo},
        {id: 6, name: 'plzen', image: plzen_logo},
        {id: 7, name: 'praha', image: praha_logo},
    ]
    
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth)
    useEffect(() => {
    }, [])

    return (
        <div className = {`${styles.logoSlider} `} style={{ '--animation-time': animationTime }}>

            <div className = {` ${styles.logoSliderWrapper} my-lg-5 my-0 py-lg-5 py-4 d-flex align-items-center`}>

                <div className = {`${styles.first} d-flex no-wrap position-absolute`}>
                    {logos.map((logo) => {
                        return (
                            <img src = {logo.image} alt = {logo.name}  key = {logo.id} className = "mx-5" style = {{maxHeight: deviceWidth > 992 ? `${maxHeight}px` : `${maxHeight/2}px`}} />
                        )
                    })}
                </div>
                <div className = {`${styles.second} d-flex no-wrap position-absolute`}>
                    {logos.map((logo) => {
                        return (
                            <img src = {logo.image} alt = {logo.name}  key = {logo.id} className = "mx-5" style = {{maxHeight: deviceWidth > 992 ? `${maxHeight}px` : `${maxHeight/2}px`}} />
                        )
                    })}
                </div>
            </div>


        </div>
    )
}

export default LogoSlider