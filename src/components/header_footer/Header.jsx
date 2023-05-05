import { Link } from "react-router-dom";

import styles from "./Header.module.scss"; 
import { useEffect, useState, useContext } from "react";  
import { GlobalAuthorizedContext } from "../../context/GlobalAuthorizedContext";

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
                                        `${styles.burgermenu} container-medium min-vh-100 h-100 bg-light` :
                                        `${styles.burgermenu} ${styles.closed} container-medium min-vh-100 h-100 bg-light`
                                    }>

                    {/* MOBILE MENU */}
                    <button className = {styles.close} onClick = {toggleMenu}>&#10060;</button>
                    <div className = "logo-and-close pt-5 pb-4 px-5 fw-900 fs-1 mb-5 bg-primary text-center">
                        <Link onClick = {toggleMenu} to = "/">SKATESPOTTER</Link>
                    </div>
                    <ul className = "d-flex flex-column align-items-center fw-600 fs-2 mx-5" onClick = {toggleMenu}>
                        <Link to = "/all-spots?category=skatepark"  className = "my-2">skateparky</Link>
                        <Link to = "/all-spots?category=spots" className = "my-2">street spoty</Link>
                        <Link to = "/find-skatepark" className = "my-2">mapa</Link>
                        <Link to = "/add-skatepark" className = "my-2">přidat spot</Link>

                        {authorized ? 
                            <div className = {`${styles.account} my-2`}>
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
                <div className = {`${styles.menutoggler} d-md-none`} onClick = {toggleMenu}>
                    <svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 41 26" >
                            <g id = "navburger" transform = "translate(-166.5 -108.5)" >
                                <line id = "Line_1" data-name = "Line 1" x2 = "40" transform = "translate(168.5 110.5)" fill = "black" stroke = "black" strokeLinecap = {'round'} strokeWidth = "4"/>
                                <line id = "Line_2" data-name = "Line 2" x2 = "30" transform = "translate(168.5 121.5)" fill = "black" stroke = "black" strokeLinecap = {'round'} strokeWidth = "4"/>
                            </g>
                    </svg>
                </div> 

                {/* TITLE */}
                <h1 className = {`${styles.title} ms-md-0 ms-auto`}><Link to = "/">skatespotter</Link></h1>

                {/* NAV LINKS */}
                <div className = {`${styles.links} ms-auto d-md-flex d-none`}>
                    <Link to = "/all-spots?category=skatepark"  className = "my-auto">skateparky</Link>
                    <Link to = "/all-spots?category=spots" className = "my-auto">street spoty</Link>
                    <Link to = "/find-skatepark" className = "my-auto">mapa</Link>

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