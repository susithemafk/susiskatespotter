import { HashRouter, Routes, Route } from 'react-router-dom' 
import Homepage from './pages/Homepage'  
import FindPlace from './pages/FindPlace'
import LayoutBasic from './components/LayoutBasic' 
import AddPlace from './pages/AddPlace'

import { useEffect, useState } from 'react'
import SingleSkatepark from './pages/Skateparks/SingleSkatepark'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp' 

import { auth } from "./firebase" 
import { onAuthStateChanged } from "firebase/auth"
import Account from './pages/Account' 
import ProtectedRoutes from './components/ProtectedRoutes'

import { GlobalAuthorizedContext } from './context/GlobalAuthorizedContext'
import AllPlaces from './pages/AllPlaces'
import SingleSpot from './pages/Spots/SingleSpot'
import EditPlace from './pages/EditPlace'
import HowToAddSpot from './pages/AddPlace/HowToAddSpot' 
import SpotsMap from './pages/SpotsMap'
import Map2 from './pages/Map2'

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
						<Route path = "/find-place" element = {<FindPlace />} />
						<Route path = "/all-places" element = {<AllPlaces />} />
						<Route path = "/how-to-add" element = {<HowToAddSpot />} />
						
						<Route path = "/spots-map" element = {<SpotsMap />} />

						<Route element = {<ProtectedRoutes />}>

							<Route path = "/account" element = {<Account />} />
							<Route path = "/add-place" element = {<AddPlace />} />
							<Route path = "/edit-place/:placeID" element = {<EditPlace />} />

						</Route>

						<Route path = "/skateparks/:skateparkID" element = {<SingleSkatepark />} />
						<Route path = "/spots/:spotID" element = {<SingleSpot />} />

						<Route path = "/map2" element = {<Map2 />} />
					</Route>

				</Routes>
			</HashRouter>
		</GlobalAuthorizedContext.Provider>
    )
}

export default App
