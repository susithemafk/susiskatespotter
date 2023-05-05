
import styles from './Carousel.module.scss'
import { useEffect, useState } from 'react'

const Carousel = ({ slides, interval }) => {

    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true) 
    const [updSlides, setUpdSlides] = useState([])
    useEffect(() => {if (slides) {setLoading(false)}}, [slides])

    const goPrevious = () => {
        setCurrentIndex(currentIndex === 0 ? updSlides?.length - 1 : currentIndex - 1) 
    } 

    const goNext = () => {
        if (updSlides.length > 1) {
            setCurrentIndex(currentIndex === updSlides?.length - 1 ? 0 : currentIndex + 1) 
        }
    } 

    useEffect(() => {
        setUpdSlides(slides)
    }, [slides])

    useEffect(() => {
        const tempInterval = setInterval(() => goNext(), interval)
        return () => {clearInterval(tempInterval)}
    }, [currentIndex]) 

    return (
        <div className = {`${styles.carousel} carousel`}>

            <div className = {`${styles.leftArrow} left-arrow`} onClick = {goPrevious}>
                <svg xmlns="http://www.w3.org/2000/svg" width="162.308" height="63.678" viewBox="0 0 162.308 63.678">
                    <path id="Path_1" data-name="Path 1" d="M3308.262,598.979l74.205,50.674,74.205-50.674" transform="translate(-3301.313 -592.03)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="10"/>
                </svg>
            </div>

            <div className = {`${styles.slide}`} style = {{backgroundImage: `url(${updSlides ? updSlides[currentIndex] : ''})`}}></div> 

            <div className = {`${styles.rightArrow} right-arrow`} onClick = {goNext}>
                <svg xmlns="http://www.w3.org/2000/svg" width="162.308" height="63.678" viewBox="0 0 162.308 63.678">
                    <path id="Path_1" data-name="Path 1" d="M3308.262,598.979l74.205,50.674,74.205-50.674" transform="translate(-3301.313 -592.03)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="10"/>
                </svg>
            </div>

            <div className = {styles.dotsWrapper}>
                {loading ? 
                (
                    <div className = {styles.loading}>
                        <p>Loading...</p>
                    </div>
                ): 
                    updSlides?.map((slide, index) => {
                        return (
                            <p key = {index} className = {`${styles.dot} ${currentIndex === index ? styles.active : ''}`} onClick = {() => setCurrentIndex(index)}>&#11044;</p>
                        )
                    })
                }

            </div>

        </div>
    )
}

export default Carousel 