import logo from "../logo.svg"; 
import React from "react";
export default function Main(){

    let [count, setCount] = React.useState(0)

    function add(){
        setCount(prevCount => prevCount+1)
    }

    function sub(){
        setCount(prevCount => prevCount-1)
    }
    
    return (
        <main>
            <h3>Counter</h3>
            <h4 className="count">{count}</h4>
            <button className="minus" onClick={sub}>-</button>
            <button className="plus" onClick={add}>+</button>



            <h2 className="hello">Hello This is React.js</h2>
            <ul>
            <li>I like React.js</li>
            <li>It is a frontend framework</li>
            <li>Developed and managed by Meta</li>
            </ul>
            <img className="back-img" src="../logo.svg" alt="back"></img>

           
            
            
        </main>
    );
}

