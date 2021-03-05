import React,{useState} from 'react';
import {Link,Redirect} from "react-router-dom";
import "../styles.css";
import { AddingIntoCart} from './CartHelpers';

const Card = ({product,showButton = true})=>{
    const [redirect,setRedirect] = useState(false);

    const addToCart = (event)=>{
       AddingIntoCart(product,setRedirect(true));
    }
    
    return (
        <div className="shadow card mb-4 border-warning" style={{maxWidth:"17rem",marginLeft:"10px"}}>
            {<img src={`http://localhost:8000/api/product/photo/${product._id}`} className="card-img-top" alt="..."/>}

            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description.substring(0,100)}</p>
                <p className="card-text">{product.price} /-</p>
                {showButton&&<Link to={`/product/${product._id}`}>
                        <button className="btn btn-outline-primary mt-2 mb-2">View Product</button>
                </Link>}
                {<p onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2" style={{marginLeft:"2px"}}>Add to Cart</p>}
                {redirect&&(<Redirect to="/cart" />)}
            </div>
        </div>
    )
}

export default Card;

        