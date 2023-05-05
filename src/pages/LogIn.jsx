import { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button' 
import { GlobalAuthorizedContext } from '../context/GlobalAuthorizedContext'

import videoFile from '../assets/skatevideo1.mp4'
import poster from '../assets/hero.jpg' 
import bgImage from '../assets/bg-magazine.jpg'

const styles = {
    backgroundImage: `linear-gradient(
        rgba(0, 0, 0, 0.8), 
        rgba(0, 0, 0, 0.8)
      ), url(${bgImage})`, 
    minHeight: "calc(100vh - 85px)"
} 

const inputStyle = {
    background: '#18123a', 
    border: '0', 
    color: 'white', 
}

const LogIn = () => {

    const [email, setEmail] = useState('') 
    const [password, setPassword] = useState('') 
    const [submitMessage, setSubmitMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const { authorized } = useContext(GlobalAuthorizedContext)

    const logIn = (e) => {
        e.preventDefault() 
        setLoading(true)

        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            // logged in
            console.log('logged in')
            setMessage('OK')
            navigate('/')
            setLoading(false)
        })
        .catch((error) => {
            // not logged in
            console.log('not logged in')
            setMessage(error.code)
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
        } else if (code === 'auth/user-not-found') {
            setSubmitMessage('Uživatel nenalezen')
        } else if (code === 'auth/wrong-password') {
            setSubmitMessage('Nesprávné heslo')
        } else {
            setSubmitMessage('Něco se pokazilo')
        }
    } 

    useEffect(() => {
        if (authorized) {
            navigate('/')
        }
    }, [authorized])
    
    return (
        <div className="login" style = {styles}>
            
            <h1 className = "text-center pt-5 text-light">Přihlášení</h1>

            <div className = "row flex-wrap container-large mx-auto">

                <div className = "col-12 col-lg-6">
                    <div className = "p-4">

                        <video
                            width="100%" 
                            height="600" 
                            poster={poster}
                            autoPlay
                            muted 
                            loop
                            playsInline
                        >
                            <source src={videoFile} type="video/mp4" />
                            Tvůj prohlížeč nepodporuje přehrávání videa.
                        </video>
                    </div>
                </div>

                <div className = "col-12 col-lg-6 mb-5 mt-3">
                
                    <form onSubmit = {logIn} className = "p-4">
                        <input required type = "email" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" value = {email} placeholder = "Email" onChange = {e => setEmail(e.target.value)} style = {inputStyle} />
                        <input required type = "password" value = {password} placeholder = "Heslo" onChange = {e => setPassword(e.target.value)} style = {inputStyle} />
                        <p className = "text-light mb-2">{submitMessage}</p>
                        <Button variant = "primary loading" type = "submit" className = "mx-auto d-block" disabled = {loading ? true : false}>Přihlásit</Button>
                    </form>

                    <div className = "text-center text-light mt-5 pt-5">
                        <h2>Nemáš ještě účet?</h2>
                        <Link to = "/sign-up">
                            <Button variant = "primary" className = "mx-auto mt-4 d-block">Zaregistrovat se</Button>
                        </Link>
                    </div>

                </div>

               

            </div>
        </div>
    )
}

export default LogIn 