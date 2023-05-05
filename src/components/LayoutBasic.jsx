import { Outlet } from "react-router-dom"; 
import Header from "./header_footer/Header"; 
import { Link } from "react-router-dom"; 
import { useState } from "react";

const LayoutBasic = () => {
    
    return (
        <div>
            <Header />
            {/* <Link to = "/">Home</Link>
            <Link to = "/find-skatepark">Find skatepark</Link>
            <Link to = "/add-skatepark">Add skatepark</Link> */}
            <main id = "layout_basic" className = "">
                <Outlet />
            </main>
        </div>
    ) 
}

export default LayoutBasic