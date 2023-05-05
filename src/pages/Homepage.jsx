import { useState, useEffect } from 'react' 
import styles from './Homepage.module.scss'
import heroimage from '../assets/hero.jpg'
import Button from '../components/Button'
import { Link } from 'react-router-dom' 

import skateparkdraw from '../assets/skateparkdraw.png'
import streetdraw from '../assets/streetdraw.png'

import { db } from '../firebase'  
import { ref, onValue } from 'firebase/database' 

import WeeklyBest from '../components/Homepage/WeeklyBest'
import TextUs from '../components/Homepage/TextUs'


const Homepage = () => {
    const [loading, setLoading] = useState(true)

    /**
     * Loads skateparks from database
    */
    const [skateparks, setSkateparks] = useState([])
    const [spots, setSpots] = useState([])
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            const data = snapshot.val()
            if (data !== null) {
                const temp = Object.values(data.skateparks)
                const temp2 = Object.values(data.spots)
                // sort by newest
                temp.sort((a, b) => {
                    return b.createdate - a.createdate
                })

                setSkateparks(temp) 
                setSpots(temp2)
                setLoading(false)
            } else {
                setSkateparks([])
                setSpots([])
            }
        })  
    }, []) 

    return (
        <div className = {styles.homepage}>

            <section className = {styles.hero}>

                <div className = {styles.background}>
                    <img src = {heroimage} alt = "hero image"></img>
                </div>
                <div className = {styles.overlay}></div>
                <div className = {`${styles.content} row`}>
                    <div className = "col-md-2"></div>
                    <div className = "col-md-4 col-12 px-4">
                        <h1 className = "fw-800 text-light display-2">NEJLEPŠÍ <br/>STREET <br/>SPOTY</h1>
                        <svg className = "ms-lg-5 ms-3 mt-4 px-md-0 px-3" xmlns="http://www.w3.org/2000/svg" width="162.308" height="63.678" viewBox="0 0 162.308 63.678">
                            <path id="Path_1" data-name="Path 1" d="M3308.262,598.979l74.205,50.674,74.205-50.674" transform="translate(-3301.313 -592.03)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="10"/>
                        </svg>
                    </div>
                    <div className = "col-6"></div>
                </div>

            </section> 



            <section className = {`${styles.streetspots} my-5 px-lg-0 px-4`}>

                <div className = {`${styles.newTitle} row justify-content-center pb-md-4`}>
                    <div className = {`${styles.image} col-lg-2 pe-xl-5 col-4 ps-md-5 ps-3`}>
                        <img src = {streetdraw} className = "w-100" alt = "skatepark illustration"></img>
                    </div>
                    <div className = "col-xl-4 col-8 my-auto pb-4 ps-5">
                        <h1 className = "mb-3 fw-900 fs-2">Nejnovější streetspoty</h1>
                        <p className = "fs-5 fw-500">Streetspoty, které přidali sami uživatelé. Koukni, navštiv, okomentuj, ohodnoť. Přidej svůj oblíbený!</p>
                    </div>
                </div>

                <div className = "row my-lg-5 flex-wrap px-xl-5 container-large mx-auto">

                    {spots.slice(0, 3).map((skatepark, index) => { return (

                        <div key = {index} className = {`${styles.streetspot} col-lg-4 col-sm-6 col-12`}>
                            <Link to = {`/skateparks/${skatepark.uuid}`}>
                                <div className = "p-3">

                                    <div className = {styles.background}>
                                        <img src = {skatepark.images[0]}></img>
                                        <div className = {styles.overlay}></div>
                                    </div>
                                    <div className = {`${styles.content} row justify-content-between w-100 p-4`}>
                                        <h3 className = "px-3 fs-4 mt-auto mb-2">{skatepark.name}</h3>
                                    </div>

                                </div>

                            </Link>
                        </div>

                    )})}

                </div>

                <Link to = "/all-spots?category=spots">
                    <Button variant = "primary" className = "mx-auto d-block fs-4 mt-lg-0 mt-4">všechny spoty</Button>
                </Link>

            </section>

            <section className = {`${styles.skateparks} my-5 px-lg-0 px-4`}>

                <div className = {`${styles.newTitle} row justify-content-center pb-md-4 px-lg-0 px-3`}>
                    <div className = "col-xl-3 col-sm-6 col-8 my-auto pb-4 pe-md-5 pe-2">
                        <h1 className = "mb-3 fw-900 fs-2">Nejnovější skateparky</h1>
                        <p className = "fs-5 fw-500">Mrkni na nejnovější spoty, které jsme přidali. Víš o nějakém, který bys chtěl přidat? Tady ho můžeš přidat!</p>
                    </div>
                    <div className = {`${styles.image} col-lg-3 col-4`}>
                        <img src = {skateparkdraw} className = "w-100" alt = "skatepark illustration"></img>
                    </div>
                </div>

                <div className = "row my-lg-5 flex-wrap px-xl-5 container-large mx-auto">


                    {skateparks.slice(0, 3).map((skatepark, index) => { return (

                        <div key = {index} className = {`${styles.streetspot} col-xl-4 col-12`}>
                            <Link to = {`/skateparks/${skatepark.uuid}`}>
                                <div className = "p-3">

                                    <div className = {styles.background}>
                                        <img src = {skatepark.images[0]}></img>
                                        <div className = {styles.overlay}></div>
                                    </div>
                                    <div className = {`${styles.content} row justify-content-between w-100 p-4`}>
                                        <h3 className = "px-3 fs-4 mt-auto mb-2">{skatepark.name}</h3>
                                    </div>

                                </div>

                            </Link>
                        </div>

                    )})}

                    

                </div>

                <Link to = "/all-spots?category=skatepark">
                    <Button variant = "primary" className = "mx-auto d-block fs-4 mt-lg-0 mt-4">všechny skateparky</Button>
                </Link>

            </section>

            <section className = {`${styles.weeklyBest} my-5 px-lg-0 px-5`}>
                {/* <h1 className = ""></h1> */}
                <div className = {`${styles.places} row container-large mx-auto flex-wrap px-lg-5 px-0`}>
                
                    <div className = {`${styles.spot} col-md-6 col-12 pb-4`}>
                        <div className = "p-lg-5 p-md-4 p-sm-3">
                            <WeeklyBest places = {spots}>SPOT TÝDNE</WeeklyBest>
                        </div>
                    </div>
                    <div className = {`${styles.skatepark} col-md-6 col-12`}>
                        <div className = "p-lg-5 p-md-4 p-sm-3">
                            <WeeklyBest places = {skateparks}>SKATEPARK TÝDNE</WeeklyBest>
                        </div>
                    </div>

                
                </div>
            </section>

            <section className = {`${styles.textUs} my-5 px-lg-0 px-5`}>

                <TextUs  />

            </section>

            <section className = {`${styles.createdBy} my-5 px-lg-0 px-0 pb-4`}>

                <h3 className = "text-center fs-2 fw-900 mb-3">vytvořil: susithemafk</h3>

                <div className = "d-flex justify-content-center">

                    <Link to = "https://www.instagram.com/susithemafk/" target = "_blank">
                        <Button variant = "primary" className = "mx-2">
                            <svg style = {{height: '50px'}} id="Vrstva_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124.5 124.69"><g id="Vrstva_1-2"><g><path d="M43.56,0c12.43,0,24.85,0,37.28,0,.72,.07,1.44,.13,2.17,.2,4.68,.42,9.45,.43,14.03,1.35,12.13,2.44,20.58,9.48,24.85,21.25,2.06,5.69,2.54,11.64,2.56,17.62,.04,14.29,.11,28.59-.04,42.88-.05,4.52-.36,9.12-1.23,13.55-2.33,11.94-9.16,20.39-20.62,24.85-5.53,2.15-11.35,2.73-17.21,2.78-13.15,.13-26.31,.26-39.47,.18-6.48-.04-13-.06-19.37-1.61-10.32-2.51-17.99-8.36-22.56-18.03-2.81-5.95-3.66-12.35-3.73-18.84C.08,72.71-.07,59.23,.04,45.75c.05-5.67,.39-11.38,1.22-16.98C2.54,20.05,6.75,12.8,13.89,7.44,20,2.85,27.09,1.03,34.58,.5c2.99-.21,5.99-.33,8.98-.5Zm18.79,113.73c0-.06,0-.13,0-.19,3.29,0,6.58,.1,9.87-.02,7.05-.25,14.16-.19,21.14-1.04,9.22-1.13,15.53-6.34,18.32-15.41,1.28-4.16,1.5-8.47,1.55-12.77,.13-11.04,.29-22.09,.19-33.13-.06-6.57-.22-13.17-.97-19.68-1.15-10.02-7.5-16.82-17.38-18.78-4.31-.86-8.78-1.11-13.18-1.19-10.88-.18-21.76-.15-32.65-.11-6.25,.02-12.51-.06-18.7,1.03-9.46,1.66-15.95,7.66-17.88,17.08-.83,4.06-1.11,8.29-1.2,12.45-.21,10.03-.29,20.06-.18,30.09,.08,7.01,.28,14.05,.94,21.03,.61,6.48,3.57,11.93,9.08,15.72,4.25,2.92,9.11,4.04,14.16,4.24,8.96,.34,17.94,.48,26.91,.7Z"/><path d="M30.26,62.42c-.06-17.64,14.36-32.06,32.05-32.07,17.67,0,31.92,14.2,32.04,31.94,.12,17.63-14.25,32.08-31.97,32.14-17.65,.06-32.06-14.3-32.12-32.02Zm31.99,20.73c11.51,.03,20.78-9.16,20.83-20.66,.05-11.5-9.14-20.79-20.64-20.86-11.55-.07-20.87,9.18-20.89,20.73-.03,11.49,9.2,20.77,20.7,20.8Z"/><path d="M95.8,21.62c4.19,.08,7.39,3.46,7.28,7.68-.11,4.11-3.47,7.31-7.62,7.24-4.12-.07-7.39-3.52-7.3-7.7,.09-4.08,3.5-7.3,7.64-7.22Z"/></g></g></svg>
                        </Button>
                    </Link>
                    <Link to = "https://www.linkedin.com/in/marek-sucharda/" target = "_blank">
                        <Button variant = "primary" className = "mx-2">
                            <svg style = {{height: '50px'}} id="Vrstva_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124.07 124"><g id="Vrstva_1-2"><g><path d="M69.62,124h-25.63V41.38h24.58v11c1.77-2.07,3.28-4.16,5.11-5.89,4.53-4.27,10.06-6.49,16.2-7.05,5.31-.49,10.59-.1,15.72,1.5,8.54,2.67,13.58,8.67,16.09,17.05,1.67,5.56,2.26,11.28,2.3,17.04,.11,16,.07,32,.08,48,0,.2-.03,.39-.07,.72h-25.67c0-.59,0-1.18,0-1.77,0-13.68,.03-27.36-.06-41.03-.02-2.86-.28-5.76-.79-8.57-1.56-8.5-7.08-11.45-15.06-10.47-7.17,.88-11.09,5.11-12.19,12.89-.4,2.84-.58,5.73-.6,8.59-.06,12.92-.03,25.84-.03,38.76,0,.59,0,1.18,0,1.85Z"/><path d="M27.68,124H2.15V41.32H27.68V124Z"/><path d="M29.76,14.85c.05,8.22-6.62,15.04-14.76,15.09C6.82,29.98,0,23.15,0,14.9,0,6.79,6.66,.07,14.79,0c8.2-.07,14.92,6.59,14.97,14.85Z"/></g></g></svg>
                        </Button>
                    </Link>

                </div>

            </section>

        </div>
    )
}

export default Homepage