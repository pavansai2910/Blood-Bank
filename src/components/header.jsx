import React from "react";
import logo from "../logo.svg"; 



function NavBar(){
    return(
        <div className="navbar">
            <nav>
                <ul>
                    <li>Price</li>
                    <li>About</li>
                    <li>Contact Us!</li>
                </ul>
            </nav>
        </div>
    );
}

function Header(){
    return (
        <header className="logo-container">
            <img src={logo} alt="logo"></img>
            <span><h2>React.js</h2></span>
            <span className="navbarspan"><NavBar/></span>
        </header>
    );
}



export default Header;