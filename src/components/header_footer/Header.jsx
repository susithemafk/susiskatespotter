import { Link } from "react-router-dom";

import styles from "./Header.module.scss"; 
import { useEffect, useState, useContext } from "react";  
import { GlobalAuthorizedContext } from "../../context/GlobalAuthorizedContext";

import rail from '../../assets/rail.png' 
import skateboard from '../../assets/skate_1.png' 
import map from '../../assets/map.png' 
import add from '../../assets/add.png'

const Header = () => {

    const { authorized, setAuthorized } = useContext(GlobalAuthorizedContext)

    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen) 
    }

    return (
        <header id = {styles.header}>

            <div className = "px-lg-5 px-md-4 px-4 d-flex py-4 align-items-center">

                <div className = { menuOpen ? 
                                    `${styles.burgerclickoutside} min-vh-100 w-100 h-100` : 
                                    `${styles.burgerclickoutside} ${styles.closed} min-vh-100 w-100 h-100`
                                    } onClick = {toggleMenu}></div>

                <nav className = { menuOpen ? 
                                        `${styles.burgermenu} container-medium min-vh-100 w-100 h-100 bg-light` :
                                        `${styles.burgermenu} ${styles.closed} container-medium min-vh-100 h-100 bg-light`
                                    }>

                    {/* MOBILE MENU */}
                    <button className = {styles.close} onClick = {toggleMenu}>&#10060;</button>
                    <div className = "logo-and-close pt-5 pb-3 px-5 fw-900 fs-1 bg-primaryy mt-4 text-center">
                        <Link onClick = {toggleMenu} to = "/">SKATESPOTTER</Link>
                    </div>
                    <hr className = "mb-5" />
                    <ul className = "d-flex flex-column align-items-center fw-600 fs-2 mx-5" onClick = {toggleMenu}>
                        
                        
                        <Link to = "/all-places?category=spots" className = "my-2">
                            <div className = "d-flex align-items-center">
                                <img src = {rail} height = {50} alt = "rail icon" className = "me-3" />
                                <h4>Street</h4>
                            </div>
                        </Link>
                        <Link to = "/all-places?category=skatepark" className = "my-2">
                            <div className = "d-flex align-items-center">
                                <img src = {skateboard} height = {50} alt = "skateboard icon" className = "me-3" />
                                <h4>Skateparky</h4>
                            </div>
                        </Link>
                        <Link to = "/find-place" className = "my-2">
                            <div className = "d-flex align-items-center">
                                <img src = {map} height = {50} alt = "map icon" className = "me-3" />
                                <h4>Mapa</h4>
                            </div>
                        </Link>
                        <Link to = "/add-place" className = "my-3">
                            <div className = "d-flex align-items-center">
                                <img src = {add} height = {35} alt = "add icon" className = "me-3" />
                                <h4>Nový spot</h4>
                            </div>
                        </Link>
                        
                        {authorized ? 
                            <div className = {`${styles.account} my-2 fw-800 mt-5 fs-1`}>
                                <Link to = "/account">
                                    můj účet
                                </Link>
                            </div>
                                    :
                            <Link to = "/log-in">přihlášení</Link>
                        }
                    </ul>
                </nav>


                {/* MENU TOGGLER */}
                {/* <h2 className = {`${styles.menutoggler} d-md-none`} onClick = {toggleMenu}>ME<br/>NU</h2>  */}
                {/* <div className = {`${styles.menutoggler} d-md-none`} onClick = {toggleMenu}> */}
                    <svg className = {`${styles.menutoggler} d-md-none`} onClick = {toggleMenu} xmlns="http://www.w3.org/2000/svg" width="56" height="17" viewBox="0 0 56 17">
                        <g id="Group_40" data-name="Group 40" transform="translate(-427 -41)">
                            <line id="Line_3" data-name="Line 3" x2="40" transform="translate(429.5 43.5)" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="5"/>
                            <line id="Line_4" data-name="Line 4" x2="30" transform="translate(429.5 55.5)" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="5"/>
                        </g>
                    </svg>

                {/* </div>  */}

                {/* TITLE */}
                <h1 className = {`${styles.title} ms-md-0 ms-auto`}><Link to = "/">skatespotter</Link></h1>

                {/* NAV LINKS */}
                <div className = {`${styles.links} ms-auto d-md-flex d-none`}>
                    <Link to = "/all-places?category=skatepark"  className = "my-auto">skateparky</Link>
                    <Link to = "/all-places?category=spots" className = "my-auto">street spoty</Link>
                    <Link to = "/find-place" className = "my-auto">mapa</Link>

                    {authorized ? 
                        <div className = {`${styles.account} `}>
                            <Link to = "/account">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36">
                                    <path id="Icon_awesome-user-alt" data-name="Icon awesome-user-alt" d="M18,20.25A10.125,10.125,0,1,0,7.875,10.125,10.128,10.128,0,0,0,18,20.25Zm9,2.25H23.126a12.24,12.24,0,0,1-10.252,0H9a9,9,0,0,0-9,9v1.125A3.376,3.376,0,0,0,3.375,36h29.25A3.376,3.376,0,0,0,36,32.625V31.5A9,9,0,0,0,27,22.5Z"/>
                                </svg>
                            </Link>
                        </div>
                                :
                        <Link to = "/log-in">přihlášení</Link>
                    }
                </div>

            </div>

        </header>
    )
}

export default Header; 