import { HashRouter, Routes, Route } from 'react-router-dom' 
import Homepage from './pages/Homepage'  
import FindSkatepark from './pages/FindSkatepark'
import LayoutBasic from './components/LayoutBasic' 
import AddSkatepark from './pages/AddSkatepark'

import { useEffect, useState } from 'react'
import SingleSkatepark from './pages/Skateparks/SingleSkatepark'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp' 

import { auth } from "./firebase" 
import { onAuthStateChanged } from "firebase/auth"
import Account from './pages/Account' 
import ProtectedRoutes from './components/ProtectedRoutes'

import { GlobalAuthorizedContext } from './context/GlobalAuthorizedContext'
import AllSpots from './pages/AllSpots'
import SingleSpot from './pages/Spots/SingleSpot'

function App() {

	const [authorized, setAuthorized] = useState(null)
	
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
				setAuthorized(user)
            } else {
				setAuthorized(null)
            }
        })
        return () => listen()
    }, []) 

	return (
		<GlobalAuthorizedContext.Provider value={{ authorized, setAuthorized }}>
			<HashRouter>
				<Routes>

					<Route path = "/" element = {<LayoutBasic />} exact>
						<Route index element = {<Homepage />} />
						<Route path = "/log-in" element = {<LogIn />} />
						<Route path = "/sign-up" element = {<SignUp />} />
						<Route path = "/find-skatepark" element = {<FindSkatepark />} />
						<Route path = "/all-spots" element = {<AllSpots />} />

						<Route element = {<ProtectedRoutes />}>

							<Route path = "/account" element = {<Account />} />
							<Route path = "/add-skatepark" element = {<AddSkatepark />} /> 
						</Route>

						<Route path = "/skateparks/:skateparkID" element = {<SingleSkatepark />} />
						<Route path = "/spots/:spotID" element = {<SingleSpot />} />
					</Route>

				</Routes>
			</HashRouter>
		</GlobalAuthorizedContext.Provider>
    )
}

export default App
