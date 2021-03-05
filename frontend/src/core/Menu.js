import React from 'react';
import {Link,withRouter} from "react-router-dom";
import {signout,isAuthenticated} from "../auth";
import {itemTotal} from './CartHelpers';
import { FaShoppingCart } from "react-icons/fa";

//Checking which Tab is Active
const isActive = (history,path)=>{
    if(history.location.pathname === path)
        return {color:"#ff9900",padding: "0.89rem 2rem"}
    else
        return {color:"#fff",padding: "0.89rem 2rem"}
}

//User or Admin Dashboard
const dashboard = (history)=>{
    if(isAuthenticated()){
        let auhtor = isAuthenticated().user.role===1?"admin":"user";
        return(
            <li className="nav-item">
                <Link className="nav-link" style  = {isActive(history,`/${auhtor}/dashboard`)} 
                    to={`/${auhtor}/dashboard`}>
                    Dashboard
                </Link>
            </li>
      )}
}
//Signin and SignUp Menu
const SignMenu = (history)=>{
    const inOut = ["SignUp","Signin"];
    if(!isAuthenticated()){
       return inOut.map((index,data)=>{
            return (
            <li className="nav-item" key={index}>
                <Link className="nav-link" to={`/${inOut[data]}`} style={isActive(history,`/${inOut[data]}`)}>
                    {inOut[data]}
                </Link>
            </li>)
        })
    }
}
//Signout
const out = (history)=>{
    if(isAuthenticated()){
        return(
        <li className="nav-item">
            <span className="nav-link" style={{cursor:"pointer",color:"#fff",padding: "0.89rem 2rem"}}
                onClick = {()=>signout(()=>history.push("/"))}>
                SignOut
            </span>
        </li>
    )}
}
//Home Button
const title = (history)=>{
    return(
    <li className="nav-item">
        <Link className="nav-link" to="/" style={isActive(history,"/")}>
            TradersMania
        </Link>
    </li>)
}
const shop = (history)=>{
    return <li className="nav-item">
        <Link className="nav-link" to="/shop" style={isActive(history,"/shop")}>
            Shop
        </Link>
    </li>
};
const Cart = (history)=>{
    return <li className="nav-item">
        <Link className="nav-link" to="/cart" style={isActive(history,"/cart")}>
            <FaShoppingCart/>{" "}
            <sup>
                <small className="cart-badge">{itemTotal()}</small>
            </sup>
        </Link>
    </li>
}
//Driver Function
const Menu = ({history})=>{
    return (
        <>
        <ul className="nav nav-tabs bg-dark sticky-top">
            {title(history)}
            {shop(history)}
            {dashboard(history)}
            {Cart(history)}
            {SignMenu(history)}
            {out(history)}
        </ul>
        </>
    );
}
//Enhancing Menu Comp. using withRouter Higher Order Comp.
export default withRouter(Menu);