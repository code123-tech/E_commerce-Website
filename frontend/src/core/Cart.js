import React,{useState,useEffect} from 'react'
import Layout from './Layout';
import { getCartItems,updateCartItem,removeItem} from './CartHelpers';
import { Link } from 'react-router-dom';
import CheckOut from './CheckOut';

 const Cart = ()=>{
    const [items,setItems] = useState([]);
    const [count,setCount] = useState(1);
    const [run,setRun] = useState(false);

    useEffect(()=>{
        setItems(getCartItems());
    },[run]);

    const Increament=(prdId,change)=>event=>{
        setRun(!run);
        change === "+" ? setCount(prevState=>prevState+1):setCount(prevState=>prevState-1)
        if(count>=1)
            updateCartItem(prdId,count); 
    }

    const removeProductClick= (id)=>event=>{
        removeItem(id);
        setRun(!run);
    }

    const showCartUpdate = (id)=>{
        return(
        <div className="input-group mb-3">
            <p onClick={Increament(id,"+")} type="button" className="btn btn-primary mb-2">+</p>
            {count>0?<p onClick={Increament(id,"-")} type="button" className="btn btn-warning mb-2 ml-2">-</p>:""}
            <p onClick={removeProductClick(id)} className="btn btn-outline-danger ml-2"> X</p>
        </div>
        )
    }

    const itemsList = receivedItems=>{
        // console.log(receivedItems);
        return (
            <>
                <h4 className="text-primary text-center">Your cart has {`${receivedItems.length}`} items</h4>
                <hr />
                {receivedItems.map((prd,i)=>(<div key={i}>
                    <div className="row" >
                        <div className="col-6">
                            <Link to={`/product/${prd._id}`}><h3>{prd.name}</h3></Link>
                            <span> X {prd.count}</span>
                        </div>
                        <div className="col-6">
                            {showCartUpdate(prd._id)}
                        </div>
                    </div>
                        <hr/></div>
                ))}
            </>
        )
    }
    const noItemInCart = ()=>{
        return (
            <h3 className="text-center">
                Your Cart is Empty now. <Link to="/shop">Continue Shopping</Link> Page.
            </h3>
        )
    }
    return (
        <Layout title="Your Shopping Cart" description="CheckOut Your Products From Here" className="container-fluid">
            {items.length>0?
            <div>
                <div>
                    {itemsList(items)}
                </div>
                <CheckOut products={items} setRun={setRun} run={run}/>
            </div>
            :noItemInCart()}
        </Layout>
    )
}
export default Cart;