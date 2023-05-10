import { useState, useEffect, useRef, useContext } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase'
import { uid } from 'uid' 
import { ref, set } from "firebase/database"; 
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import { GlobalAuthorizedContext } from '../context/GlobalAuthorizedContext'
import { getAuth } from "firebase/auth";
import { onValue } from "firebase/database";

import videoFile from '../assets/skatevideo1.mp4'
import poster from '../assets/hero.jpg' 
import bgImage from '../assets/bg-magazine.jpg'

import styles from './SignUp.module.scss'

const inputStyle = {
    background: '#18123a', 
    border: '0', 
    color: 'white', 
}

const SignUp = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('') 
    const [password, setPassword] = useState('') 
    const [submitMessage, setSubmitMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const { authorized } = useContext(GlobalAuthorizedContext)

    const navigate = useNavigate()

    const registerUser = () => {
        const uuid = uid() 
        const user = {
            uuid: uuid, 
            username: username, 
            email: email, 
            role: 'user'
        }

        set(ref(db, `/users/${uuid}`), user)
            .then(() => {
                console.log('user added to the database')
                setLoading(false)
                navigate('/')
            })
            .catch((error) => {
                alert('error adding to database, try again or leave us a message')
                console.log(error)
                setLoading(false)
            })

    } 

    const setMessage = (code) => {
        if (code === 'auth/invalid-email') {
            setSubmitMessage('Neplatný email')
        } else if (code === 'auth/weak-password') {
            setSubmitMessage('Slabé heslo')
        } else if (code === 'auth/email-already-in-use') {
            setSubmitMessage('Email je již použitý')
        } else {
            setSubmitMessage('Něco se pokazilo')
        }
    }

    const signUp = (e) => {
        e.preventDefault() 
        setLoading(true)
        console.log(checkUsernameAvailability(username))

        if (checkUsernameAvailability(username)) {

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user 
                    registerUser()

                    console.log('signed up')
                    // console.log(user)
                })
                .catch((error) => {
                    // Not signed up
                    console.log('not signed up')
                    console.log(error)
                    setLoading(false)
                    
                    setMessage(error)
                })

        } else {
            setSubmitMessage('Přezdívka je již použitá')
            setLoading(false)
        }
    } 

    /**
     * gets all users from database
     */
    const [data, setData] = useState(null)
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            // gets all data from database
            const data = snapshot.val()
            setData(data) 
        })
    }, [])

    /**
     * checks if username is already taken
     */
    const checkUsernameAvailability = (username) => {
        const user = Object.values(data?.users).find(user => user.username === username) 
        if (user) return false 
        else return true
    }

    /**
     * sets height of wrapper for safari, then set up in scss by %
     */
    const wrapperRef = useRef(null)
    const setHeightsForSafari = () => {
        const pageHeight = window.innerHeight - 85 // - header height

        if (wrapperRef.current) {
            wrapperRef.current.style.minHeight = `${pageHeight}px`
        }
    } 
    useEffect(() => {
        setHeightsForSafari()
    }, [])

    useEffect(() => {
        if (authorized) {
            navigate('/')
        }
    }, [authorized]) 
    
    return (
        <div className = {`${styles.signup}`} ref = {wrapperRef} style = {{backgroundImage: `linear-gradient(
            rgba(0, 0, 0, 0.8), 
            rgba(0, 0, 0, 0.8)
          ), url(${bgImage})`  }}>
    
            <h1 className = "text-center pt-lg-5 pt-4 text-light">Nový účet</h1>
        
            <div className = "row flex-wrap container-large mx-auto">

                <div className = "col-12 col-lg-6">
                    <div className = {`${styles.videoWrapper} m-4`}>

                        <video
                            width="100%" 
                            // height="600" 
                            poster={poster}
                            autoPlay
                            muted 
                            loop
                            playsInline

                            className = {styles.video}
                        >
                            <source src={videoFile} type="video/mp4" />
                            Tvůj prohlížeč nepodporuje přehrávání videa.
                        </video>
                    </div>
                </div>
                
                <form onSubmit = {signUp} className = "col-12 col-lg-6 mb-5 mt-3">
                    <div className = "px-4 pt-lg-5">
                        <input required type = "text" value = {username} placeholder = "Přezdívka" onChange = {e => setUsername(e.target.value)} style = {inputStyle} />
                        <input required type = "email" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" value = {email} placeholder = "Email" onChange = {e => setEmail(e.target.value)} style = {inputStyle} />
                        <input required type = "password" value = {password} placeholder = "Heslo" onChange = {e => setPassword(e.target.value)} style = {inputStyle} />
                        <p className = "text-light mb-2">{submitMessage}</p>
                        <Button variant = "primary loading" type = "submit" className = "mx-auto d-block" disabled = {loading ? true : false}>Zaregistrovat</Button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default SignUp 