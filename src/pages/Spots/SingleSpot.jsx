import { useParams } from "react-router-dom"
import styles from './SingleSpot.module.scss'
import { useContext, useEffect, useRef, useState } from "react" 
import { db } from "../../firebase"
import { onValue, ref } from "firebase/database"
import Rating from "../../components/Rating"
import Carousel from "../../components/Carousel"
import Button from "../../components/Button"
import AddComment from "../../components/Skateparks/AddComment"
import { GlobalAuthorizedContext } from "../../context/GlobalAuthorizedContext"
import DeleteComment from "../../components/Skateparks/DeleteComment"
import { getAuth } from "firebase/auth"
import { Link } from "react-router-dom"
import findUserComments from '../../functions/findUserComments'


const SingleSpot = () => {

    const { authorized } = useContext(GlobalAuthorizedContext)

    const { spotID } = useParams()

    const [spot, setSpot] = useState({}) 
    const [loading, setLoading] = useState(true) 

    const [users, setUsers] = useState({}) 

    useEffect(() => {window.scrollTo(0, 0)}, [])

    // useEffect(() => {console.log(spot)}, [spot])

    /**
     * Loads spot and users from database
     */
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            const data = snapshot.val()
            if (data !== null) {
                setSpot(data.spots[spotID]) 
                setUsers(data.users)
                setLoading(false)
            } else {
                setSpot({})
            }
        })  
        
    }, []) 

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

    /**
     * if id of user that commented === spot id, 
     * return his username
     */
    const findUsersUsername = (uuid) => {
        let tempUser
        Object.values(users).map(user => {
            if (user.uuid === uuid) {
                tempUser = user
            }
        })
        return tempUser?.username
    } 

    /**
     * gets all and current user from database
    */
    const [data, setData] = useState({})
    const [currentUser, setCurrentUser] = useState({})
    const [commentsMatched, setCommentsMatched] = useState([])
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            // gets all data from database
            const data = snapshot.val()
            setData(data)

            // sets current user from database
            const auth = getAuth() 
            const user = Object.values(data?.users).find(user => user?.email === auth.currentUser?.email) 
            setCurrentUser(user)
        })
    }, []) 
    /**
     * get current user comments
     */
    useEffect(() => {
        
        const currUserAllComments = findUserComments(data, currentUser?.uuid) 
        let matchedComments = [] 

        const curUserComms = currUserAllComments ? Object.values(currUserAllComments) : []
        curUserComms.map(currComment => {
            const found = spot?.comments ? Object.values(spot.comments).find(skateComment => JSON.stringify(skateComment) == JSON.stringify(currComment)) : []
            matchedComments = [...matchedComments, found]
        })

        setCommentsMatched(matchedComments)
    }, [currentUser])

    const [submitMessage, setSubmitMessage] = useState('') 

    return (
        <div className = {styles.singleSkatepark}>
            
            
            <div className = {`${styles.content} mt-lg-5 mt-2 container-large mx-auto`}>
                <div className = "row flex-wrap">
                    <div className = "col-12 col-lg-7 p-lg-5 p-3">
                        <div className = {styles.carousel}>
                            <Carousel slides = {spot.images} interval = {5000} />
                        </div>
                    </div>
                    <div className = "col-12 col-lg-5 py-lg-5 p-3">
                        <div className = {styles.details}>
                            <div>
                                <h1 className = "fw-black mb-3">{spot.name}</h1>
                                <p className = "mb-4">{spot.description}</p>
                                <p className = "fw-600">Adresa: <span className = "fw-400">{spot.address}</span></p>
                                <p className = "fw-600">Město: <span className = "fw-400">{spot.city}</span></p>
                                <div className = "mt-4" style = {{cursor: 'pointer'}}>
                                    <span className = "fw-600">Souřadnice: </span>
                                    {copied ? <p>Copied to clipboard</p> : <p onClick = {() => copyValue(spot.lat, spot.lng)}>{spot.lat}, {spot.lng}</p>}
                                </div>
                                <Link to = {`/find-skatepark?spot=${spot.uuid}`}><Button variant = "secondary" className = "my-3">zobrazit na mapě</Button></Link>
                            </div>
                            <Rating rating = {spot?.comments ? Object.values(spot.comments).map(comment => comment.rating) : []} width = {175} />

                        </div>
                    </div>

                </div>
            </div>

            <div className = {`${styles.discussion} mt-5 p-lg-5 p-3 container-medium mx-auto bg-primary`}>
                <h1 className = "fw-black mb-3">Diskuze</h1>

                {spot?.comments ? Object.values(spot.comments).length > 0 &&
                    null : 
                    <p className = "fw-700 fs-4 mb-4">Zatím zde nejsou žádné komentáře :(</p>
                }
                
                {spot.comments ? Object.values(spot.comments).map((comment, index) => {
                    const userName = findUsersUsername(comment.user) 

                    return (
                        <div className = {`${styles.comment} row flex-wrap my-5`} id = {comment.commentid} key = {index}>

                            <div className = "col-12 col-lg-2 pe-lg-4">
                                <div className = {styles.iconWrapper}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36">
                                        <path id="Icon_awesome-user-alt" data-name="Icon awesome-user-alt" d="M18,20.25A10.125,10.125,0,1,0,7.875,10.125,10.128,10.128,0,0,0,18,20.25Zm9,2.25H23.126a12.24,12.24,0,0,1-10.252,0H9a9,9,0,0,0-9,9v1.125A3.376,3.376,0,0,0,3.375,36h29.25A3.376,3.376,0,0,0,36,32.625V31.5A9,9,0,0,0,27,22.5Z"/>
                                    </svg>
                                </div>
                                <p className = "fw-600">{userName}</p>
                                <Rating rating = {[comment.rating]} showCount = {false} width = {100} black = {true} />
                            </div>

                            <div className = {`${styles.right} ps-lg-4 col-12 col-lg-10`}>
                                <p className = "fw-600">{comment.text}</p>
                            </div>

                            {commentsMatched.includes(comment) &&
                                <div className = "fw-600 w-100">
                                    <DeleteComment object = {spot} comment = {comment}><p className = "text-underline"><button>odstranit</button></p></DeleteComment>
                                </div>
                            }

                        </div>
                    )
                }) : []} 

                {authorized &&
                    <>
                        <h2>Přidat komentář a hodnocení</h2>
                        <AddComment spot = {spot} isSkatepark = {false} users = {users} />
                    </>
                } 
                {!authorized &&
                    <>
                        <h3>Pro přidání příspěvku do diskuze se musíte přihlásit</h3>
                        <Link to = "/log-in"><Button variant = "primary" className = "mt-3">Přihlásit se</Button></Link>
                    </>
                }
            </div>

            <Link to = "/all-spots">
                <Button variant = "primary" className = "my-5 mx-auto d-block">Zpět na všechny spoty</Button>
            </Link>


        </div>
    )
}

export default SingleSpot