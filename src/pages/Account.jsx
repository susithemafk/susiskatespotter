
import { getAuth, signOut } from "firebase/auth"; 
import { auth, db } from "../firebase"; 
import { set } from "firebase/database";
import { onValue, ref } from "firebase/database";
import Button from "../components/Button"; 
import { useState, useEffect } from "react"; 
import { updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; 
import { Link, useNavigate } from "react-router-dom"; 
import Rating from "../components/Rating";  
import DeleteComment from "../components/Skateparks/DeleteComment"; 

import findUserComments from '../functions/findUserComments'

import styles from './Account.module.scss'
import MySpots from "../components/Account/MySpots";

const Account = () => {

    const navigate = useNavigate()

    /**
     * sign out function on button click
     */
    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('signed out') 
            navigate('/')
        })
    }

    const [password, setPassword] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newUsername, setNewUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [currentUser, setCurrentUser] = useState({})
    const [data, setData] = useState({}) 

    /**
     * uploads users newEmail to database
     */
    const uploadToDatabase = (user) => {
        const newUser = {
            ...user, 
            email: newEmail
        }
        set(ref(db, `/users/${user.uuid}`), newUser) 
            .then(() => {
                setPassword('')
                setNewEmail('')
                setEditingEmail(false)
                console.log('successfully uploaded user to database')
            })
            .catch((error) => {
                alert('error uploading user to database, try later or leave us a message')
                console.log('error uploading user to database')
                console.log(error)
            })
    }

    /**
     * finds user by his previous email
     */
    const findUser = (oldEmail) => {
        const user = Object.values(data.users).find(user => user.email === oldEmail)
        uploadToDatabase(user)
    }

    /**
     * gets all users from database
     */
    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            // gets all data from database
            const data = snapshot.val()
            setData(data) 

            // sets current user from database
            const auth = getAuth() 
            const user = Object.values(data?.users).find(user => user.email === auth.currentUser.email) 
            setCurrentUser(user)
        })
    }, [])

    /**
     * edits users email after inserting correct password
     */
    const editEmail = (e) => {
        e.preventDefault() 

        const auth = getAuth() 
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            password
        ) 

        const oldEmail = auth.currentUser.email

        reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
            console.log('successfully authenticated, changing email...') 
            updateEmail(auth.currentUser, newEmail)
            .then(() => {
                console.log('successfully changed email, finding user in database...') 
                findUser(oldEmail)
            })
            .catch((error) => {
                alert('error changing email')
                console.log('error changing email')
                console.log(error) 
            });
        })
        .catch((error) => {
            alert('error authenticating')
            console.log('error authenticating')
            console.log(error)
        }) 
    } 

    /**
     * edits username and posts to database, doesnt require authentication
     */
    const editUsername = (e) => {
        e.preventDefault() 

        const newUser = {
            ...currentUser, 
            username: newUsername
        }
        
        set(ref(db, `/users/${currentUser.uuid}`), newUser)
            .then(() => {
                console.log('editing username successful')
                setNewUsername('')
                setEditingUsername(false)
            })
            .catch((error) => {
                alert('error editing username, try later or leave us a message')
                console.log('error editing username')
                console.log(error)
            })
    }

    /**
     * edits users password after inserting correct password
     */
    const editPassword = (e) => {
        e.preventDefault() 

        const auth = getAuth() 
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            password
        ) 

        reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
            console.log('successfully authenticated, changing password...') 
            updatePassword(auth.currentUser, newPassword)
            .then(() => {
                setEditingPassword(false)
                console.log('successfully changed password') 
            })
            .catch((error) => {
                console.log('error changing password')
                console.log(error) 

                if (error.code === 'auth/invalid-email') {
                    alert('Neplatný email')
                } else if (error.code === 'auth/weak-password') {
                    alert('Slabé heslo')
                } else if (error.code === 'auth/email-already-in-use') {
                    alert('Email je již použitý')
                } else {
                    alert('Něco se pokazilo')
                }
            });
        })
        .catch((error) => {
            alert('špatné heslo')
            console.log('error authenticating')
            console.log(error)
        }) 
    } 

    /**
     * deletes a user after authenticating
     */
    const deleteAccount = (e) => {
        e.preventDefault() 

        if (window.confirm('Jste si jisti, že chcete svůj účet smazat?')) {

            const auth = getAuth() 
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                password
            ) 

            reauthenticateWithCredential(auth.currentUser, credential)
            .then(() => {
                console.log('successfully authenticated, deleting account...') 
                deleteUser(auth.currentUser)
                .then(() => {
                    setDeletingAccount(false) 
                    console.log('successfully deleted account') 
                    
                    navigate('/')
                })
                .catch((error) => {
                    alert('error deleting account')
                    console.log('error deleting account')
                    console.log(error) 
                });
            })
            .catch((error) => {
                alert('error authenticating')
                console.log('error authenticating')
                console.log(error)
            }) 

        } else {
            console.log('jeste ze tak');
        }
    } 

    const [editingUsername, setEditingUsername] = useState(false)
    const [editingEmail, setEditingEmail] = useState(false)
    const [editingPassword, setEditingPassword] = useState(false)
    const [deletingAccount, setDeletingAccount] = useState(false) 

    /**
     * this function finds the skatepark, that has the comment sent to this function
     * used for edit and delete comment buttons
     */
    const findSkateparkByCommentID = (comment) => {
        const commentId = comment.commentid 
        const allPlaces = [] 
        let match = {}

        Object.values(data.skateparks).map(skatepark => {
            allPlaces.push(skatepark)
        })
        Object.values(data.spots).map(spot => {
            allPlaces.push(spot)
        })

        allPlaces.map(place => {
            if (place.comments) {
                Object.values(place.comments).map(comment => {
                    if (comment.commentid === commentId) {
                        match = place
                    }
                })
            }
        }) 

        return match
    } 

    return (
        <div className = {`${styles.account} px-md-4`}>
            
            <h1 className = "text-center mt-5 pt-3 fs-1 fw-800 mb-2">Můj účet</h1>
            <p className = "text-center fs-4 container-small mx-auto">zde si můžeš upravit svůj účet a procházet přidané komentáře</p>

            <div className = {`${styles.container} container-medium mx-auto my-55 p-lg-5 p-4 fw-700`}>

                <div className = {`${styles.details} p-4`}>

                    <h1 className = "fs-2">Údaje</h1>

                    <div className = "col-md-8 col-12">

                        {!editingUsername ? 
                            <div className = "d-flex justify-content-between pt-3">
                                <p>Přezdívka: {currentUser.username}</p>
                                <button className = "text-underline " onClick = {() => setEditingUsername(true)}>změnit</button>
                            </div>
                                
                        : 

                            <form onSubmit = {(e) => editUsername(e)} className = "row flex-wrap justify-content-between align-items-center mt-2 pt-1">
                                <p className = "">Přezdívka: </p>
                                <input required type = "text" minLength={5} value = {newUsername} placeholder = "Nová přezdívka" onChange = {e => setNewUsername(e.target.value)} className = "mb-0 w-100 my-2" />
                                <button type = "reset" className = "px-2 text-underline" onClick = {() => {setEditingUsername(false); setNewUsername('')}}>zrušit</button>
                                <button type = "submit" className = "px-2 text-underline">změnit</button>
                            </form>
                            
                        }
                        
                            <div className = "d-flex justify-content-between mt-2 pt-1">
                                <p>Email: {currentUser.email}</p>
                                <button className = {`text-underline ${editingEmail ? 'd-none' : ''}`} onClick = {() => setEditingEmail(true)}>změnit</button>
                            </div>
                                
                        {editingEmail ?

                            <form onSubmit = {(e) => editEmail(e)} className = "row align-items-center justify-content-between mt-2 pt-1 mb-5 flex-wrap">
                                <input required type = "password" value = {password} placeholder = "Heslo pro ověření" onChange = {e => setPassword(e.target.value)} className = "mb-2 w-100" />
                                <input required type = "text" value = {newEmail} placeholder = "Nový email" onChange = {e => setNewEmail(e.target.value)} className = "mb-3 " />
                                <button type = "reset" className = "me-3 text-underline" onClick = {() => {setEditingEmail(false); setNewEmail('')}}>zrušit</button>
                                <button type = "submit" className = "text-underline">změnit</button>
                            </form>
                            
                        : ''} 

                        <button className = {`text-underline mt-2 pt-1 me-3 ${editingPassword ? 'd-none' : ''}`} onClick = {() => setEditingPassword(true)}>změnit heslo</button>

                        {editingPassword ?
                            <form onSubmit = {(e) => editPassword(e)} className = "row align-items-center py-1 mt-2 mb-5 flex-wrap">
                                <input required type = "password" value = {password} placeholder = "Staré heslo" onChange = {e => setPassword(e.target.value)} className = "mb-2 w-100" />
                                <input required type = "password" value = {newPassword} placeholder = "Nové heslo" onChange = {e => setNewPassword(e.target.value)} className = "mb-3 " />
                                <button type = "reset" className = "me-3 text-underline" onClick = {() => {setEditingPassword(false); setNewPassword('')}}>zrušit</button>
                                <button type = "submit" className = "text-underline">změnit</button>
                            </form>
                        : ''}

                        <button className = {`text-underline ${deletingAccount ? 'd-none' : ''}`} onClick = {() => setDeletingAccount(true)}>smazat účet</button>

                        {deletingAccount ?
                            <form onSubmit = {(e) => deleteAccount(e)} className = "row align-items-center py-1 mt-2 mb-5 flex-wrap">
                                <input required type = "password" value = {password} placeholder = "Zadejte heslo" onChange = {e => setPassword(e.target.value)} className = "mb-2 w-100" />
                                <button type = "reset" className = "me-3 text-underline" onClick = {() => {setDeletingAccount(false); setPassword('')}}>zrušit</button>
                                <button type = "submit" className = "text-underline">smazat</button>
                            </form>
                        : ''}

                    </div>

                    <Button className = "mt-5 d-block" variant = "white" onClick = {userSignOut} text = "Sign Out">Odhlásit</Button>

                </div>

                <h1 className = "mt-5 fs-2">Moje komentáře</h1>

                {findUserComments(data, currentUser.uuid) ? Object.values(findUserComments(data, currentUser.uuid)).map((comment, index) => {
                    const skateparkMatchingComment = findSkateparkByCommentID(comment)
                    return (
                        <div className = {`${styles.comment} row flex-wrap my-5`} key = {index}>

                            <div className = "col-12 col-lg-2 pe-lg-4">
                                <div className = {styles.iconWrapper}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36">
                                        <path id="Icon_awesome-user-alt" data-name="Icon awesome-user-alt" d="M18,20.25A10.125,10.125,0,1,0,7.875,10.125,10.128,10.128,0,0,0,18,20.25Zm9,2.25H23.126a12.24,12.24,0,0,1-10.252,0H9a9,9,0,0,0-9,9v1.125A3.376,3.376,0,0,0,3.375,36h29.25A3.376,3.376,0,0,0,36,32.625V31.5A9,9,0,0,0,27,22.5Z"/>
                                    </svg>
                                </div>
                                <p>{currentUser.username}</p>
                                <Rating rating = {[comment.rating]} showCount = {false} width = {100} black = {true} />
                            </div>

                            <div className = {`${styles.right} ps-lg-4 col-12 col-lg-10 mt-lg-0 mt-3`}>
                                <p className = "fw-600">{comment.text}</p>
                            </div>

                            <div className = "fw-600 w-100 d-flex justify-content-end mb-2">
                                <Link to = {`/${skateparkMatchingComment?.category === 'skatepark' ? 'skateparks' : 'spots'}/${skateparkMatchingComment?.uuid}`}><button className = "me-4 text-underline">zobrazit</button></Link>
                                <DeleteComment object = {skateparkMatchingComment} comment = {comment} className = ""><p className = "text-underline m-0"><button>odstranit</button></p></DeleteComment>
                            </div>

                        </div>
                    )
                }) : []}

                <section className = {`${styles.places} my-5`}>
                    <h1 className = "fs-2">Moje místa</h1>

                    <MySpots 
                        places = {[data?.skateparks, data?.spots]} 
                        currentUser = {currentUser ? currentUser : ''} />

                </section>

            </div>

            

        </div>
    )
}

export default Account