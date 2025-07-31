import React from "react";
import logo from "../logo.svg"; 


import "../index.css"; 
import Header from "./header.jsx";
import Main from "./main.jsx"; 
import Footer from "./footer.jsx";



function MyFirstComponent() {
    return (
        <div>
            <h1>Hello, React!</h1>
            <p>This is my first React component.</p>
        </div>
    );
}





function WhyReact(){
    return (
        <>
            <Header/>
            <Main/>
            <Footer/>
        </>
    );
}


// ReactDOM.createRoot(document.getElementById("root")).render(
//     <App />  // Remove <React.StrictMode>
// );
// export default MyFirstComponent;
export default WhyReact;