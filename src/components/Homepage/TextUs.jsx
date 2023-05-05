import { useContext, useState, useEffect } from "react" 
import { GlobalAuthorizedContext } from "../../context/GlobalAuthorizedContext"
import Button from "../Button" 
import { uid } from "uid"
import { getAuth } from "firebase/auth"
import { db } from "../../firebase"
import { ref, set, onValue } from "firebase/database"


const TextUs = () => {

    const authorized = useContext(GlobalAuthorizedContext)

    const [name, setName] = useState(authorized?.authorized?.email ?? '')
    const [email, setEmail] = useState(authorized?.authorized?.email ?? '') 
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [currentUser, setCurrentUser] = useState({}) 

    /**
     * gets all users from database
     */
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            // gets all data from database
            const data = snapshot.val()

            // sets current user from database
            const auth = getAuth() 
            const user = Object.values(data?.users).find(user => user?.email === auth?.currentUser?.email) 
            setCurrentUser(user)
        })
    }, [])

    /**
     * 
     */
    const handleSubmit = (e) => {
        e.preventDefault()
        const uuid = uid() 

        const emailObject = {
            emailid: uuid, 
            date: Date.now(), 
            name: name, 
            email: email, 
            message: message, 
            sentby: authorized ? currentUser?.uuid : 'not logged in'
        } 

        set(ref(db, `/emails/${uuid}`), emailObject)
            .then(() => {
                console.log('email sent')
                setSubmitted(true)
                setName('') 
                setEmail('') 
                setMessage('') 
            })
            .catch((error) => {
                console.log(error)
            })
    } 



    return (
        <div className = {`text-us my-5 px-lg-5 container-medium mx-auto`}>

            <h2 className = "mb-3 fs-1">Napište nám</h2>

            <form onSubmit={handleSubmit} className = "">

                <div className = "row flex-wrap">
                    <div className = "col-lg-6 col-12 pe-lg-2">
                        <input required type="text" placeholder = "Jméno" name="name" value={name} onChange={(e) => setName(authorized ? currentUser?.username : e.target.value)} />
                    </div>
                    <div className = "col-lg-6 col-12 ps-lg-2">
                        <input required type="text" placeholder = "Email" name="email" value={email} onChange={(e) => setEmail(authorized ? currentUser.email : e.target.value)} />
                    </div>
                </div>
                <textarea required name="message" placeholder = "Zpráva" value={message} onChange={(e) => setMessage(e.target.value)} />

                <Button variant = "primary loading" type = "submit" className = "mx-auto d-block" disabled = {loading ? true : false}>{submitted ? 'Děkujeme' : 'Odeslat'}</Button>

            </form>
        </div>
    )
}

export default TextUs