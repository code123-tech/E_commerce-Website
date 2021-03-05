import React,{useState,useEffect} from 'react'
import Layout from './../core/Layout';
import { isAuthenticated } from './../auth';
import { Link } from 'react-router-dom';
import { getProducts, getStatusValues,updateOrderStatus} from './apiAdmin';
import { Redirect } from 'react-router-dom';
import  moment from 'moment';

const Order = ()=>{
    const [fetchedOrders,setFetchedOrders] = useState([]);
    const [statusValues,setStatusValues] = useState([]);
    const [error,setError] = useState(false);

    const userid = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    const loadProducts = ()=>{
        getProducts(userid,token)
        .then(data=>{
            if(!data){
                console.log("Error in Fetching Data");
                setError(true);
            }
            setFetchedOrders(data);
        })
    }
    const loadStatusValues = ()=>{
        getStatusValues(userid,token)
            .then(data=>{
                if(!data){
                    console.log("Error in Fetching Status Values");
                }
                setStatusValues(data);
            })
    }
    useEffect(()=>{
        loadProducts();
        loadStatusValues();
    },[]);

    const noOrderMessage = ()=>{
        return <h2 className="text-center">No Order Has been made Yet.</h2>
    }
    const details = (key,value)=>{
        return <tr>
                <td>{key}</td>
                <td>{value}</td>
            </tr>
    }

    const handleStatusChange = (e,orderId)=>{
        updateOrderStatus(userid,token,orderId,e.target.value)
            .then(data=>{
                if(!data){
                    console.log("Status Update Failed")
                }else{
                    loadProducts();
                }
            })
    }
    const showStatus = (o)=>(
        <tr className="form-group">
            <td>Status: </td>
            <td>
                {o.status}
                <select className="form-control"
                onChange ={e=>handleStatusChange(e,o._id)}
                >
                    <option>Update Status</option>
                    {statusValues && statusValues.map((status,index)=>(
                        <option key={index} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </td>
        </tr>
    )
    const showProducts = products=>{
        return (<>
            <h2 className="text-center text-primary"><u>Total Orders: {products.length}</u></h2>
            {products.map((o,oIdx)=>{
                return (
                    <div className="table-responsive-sm mb-2" key={oIdx}>
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Order Key</th>
                                    <th scope="col">Order Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details("Order Number: ",oIdx+1)}
                                {details("Order Id: ",o._id)}
                                {showStatus(o)}
                                {details("Transaction Id: ",o.transaction_id)}
                                {details("Total Ammount: ",o.amount)}
                                {details("Ordered By: ",o.user.name)}
                                {details("Ordered On: ",moment(o.createdAt).fromNow())}
                                {details("Delievery Address: ",o.address)}
                                {details("Total Type of Products in the Order: ",o.products.length)}
                            </tbody>
                        </table>
                        <h3 className="text-center text-primary"><u>Product Details:</u></h3>
                        <div className="table-responsive-sm mb-2">
                            <table className="table table-hover table-dark">
                                <thead>
                                    <tr>
                                        <th scope="col">Product Number</th>
                                        <th scope="col">Product name</th>
                                        <th scope="col">Product Price</th>
                                        <th scope="col">Product Ordered</th>
                                        <th scope="col">Product ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {o.products.map((p,pIdx)=>{
                                        return (
                                            <tr key={pIdx}>
                                                <td>{pIdx+1}</td>
                                                <td><Link to={`/product/${p._id}`}>{(p.name)}</Link></td>
                                                <td>{(p.price)}</td>
                                                <td>{(p.count)}</td>
                                                <td>{(p._id)}</td>
                                            </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <hr/>
                    </div>
                )
            })}
            </>
        )
    }
    return (
        <Layout title="Orders By Users" description="See Your User's Orders Here" className="container-fluid">
            {
                !error
                ?fetchedOrders&&fetchedOrders.length>0?showProducts(fetchedOrders):noOrderMessage()
                :<Redirect to="/error" />
            }
        </Layout>
    )
}
export default Order;