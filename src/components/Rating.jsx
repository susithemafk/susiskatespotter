import { useEffect, useState } from 'react'
import styles from './Rating.module.scss'

const Rating = ({ rating, showCount = true, width, black=false }) => { 

    const [fullWidth, setFullWidth] = useState(width)
    const [fullHeight, setFullHeight] = useState(width/5)

    const [finalRating, setFinalRating] = useState(0)
    
    /**
     * counts average rating
     * then counts width of stars div by the average rating
     */
    const countRating = () => {
        if (rating && rating.length > 0) {
             // removes empty values from array
            const sum = rating.reduce((a, b) => a + b) 
            const average = sum / rating.length

            const starsWidth = Math.round((average/100) * fullWidth)
            setFinalRating(starsWidth)
        } else {
            setFinalRating(0)
        }
    }

    /**
     * removes empty values from array and returns updated rating variable
     * then runs countRating function
     */
    useEffect(() => {
        countRating()
    }, [rating]) 


    const starEmpty = `
        <svg xmlns="http://www.w3.org/2000/svg" id="icons_star-empty" data-name="icons/star-empty" width="15" height="15" viewBox="0 0 15 15">
            <rect id="Rectangle" width="15" height="15" fill="none"/>
            <path id="star-full" d="M7.5,11.992l.725.422,1.6.921q1.6.921,1.59.921l.718.422-.19-.787-.418-1.736q-.418-1.736-.418-1.743l-.19-.794.637-.534,1.406-1.167,1.406-1.167L15,6.215,12.3,5.99l-1.853-.148-.842-.063-.33-.752L8.555,3.382Q7.83,1.738,7.83,1.745L7.5,1l-.33.745L6.445,3.382Q5.72,5.02,5.72,5.027l-.33.752-.842.063L2.7,5.99,0,6.215l.637.534L2.043,7.916,3.45,9.083l.637.534-.19.794-.418,1.743Q3.061,13.9,3.061,13.89l-.19.787.718-.422,1.59-.921q1.59-.921,1.6-.921l.725-.422Z" transform="translate(0 -0.24)" fill="#e0e0e0" fill-rule="evenodd"/>
        </svg>` 
    const starFull = `
        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31">
            <g fill="none" fill-rule="evenodd">
                <path d="M0 0h31v31H0z"/>
                <path fill="${black ? '#000' : '#FFD538'}" d="M15.501 23.972l1.499.861 3.3 1.878a370.59 370.59 0 0 1 3.284 1.878l1.483.861-.393-1.606-.863-3.54c-.576-2.36-.863-3.546-.863-3.556l-.394-1.62 1.317-1.09 2.906-2.38 2.906-2.38L31 12.188l-5.57-.459-3.83-.301-1.74-.13-.682-1.533L17.68 6.41c-1-2.236-1.499-3.35-1.499-3.34L15.5 1.55l-.681 1.52-1.499 3.34c-.999 2.227-1.498 3.345-1.498 3.355l-.681 1.534-1.741.129-3.83.301-5.57.459 1.317 1.09 2.906 2.38 2.906 2.38 1.317 1.09-.394 1.62-.863 3.556c-.575 2.37-.863 3.55-.863 3.54l-.393 1.606 1.483-.86L10.7 26.71c2.19-1.252 3.29-1.878 3.3-1.878l1.498-.86h.002z"/>
            </g>
        </svg>`

    const encodedStarEmpty = encodeURIComponent(starEmpty) 
    const encodedStarFull = encodeURIComponent(starFull)

    return (
        <div className = {`${styles.starsWrapper} rating`} >
            
            <div 
                // Wrapper
                className = {styles.starsWrapper} 
                style = {{width: fullWidth, height: fullHeight}}
            >
                <div 
                    // Rating wrapper
                    className={styles.starratingwrapper} 
                    style = {{
                        width: fullWidth, 
                        height: fullHeight,
                    }}
                >
                    <div 
                        // Empty stars
                        className={styles.emptystarselement} 
                        style = {{
                            width: fullWidth, 
                            height: fullHeight, 
                            background: `url("data:image/svg+xml,${encodedStarEmpty}") repeat-x`,
                            backgroundSize: `${fullHeight}px auto`, 
                        }}
                    ></div>
                    <div 
                        // Full stars
                        className={styles.starselement} 
                        style = {{
                            width: `${finalRating ? finalRating : '0'}px`, 
                            background: `url("data:image/svg+xml,${encodedStarFull}") repeat-x`,
                            backgroundSize: `${fullHeight}px auto`, 
                        }}
                    ></div>
                </div>
                {showCount ? <small className = {styles.rating}>({rating.length})</small> : ''} 
            </div>
        </div>
    )
}

export default Rating