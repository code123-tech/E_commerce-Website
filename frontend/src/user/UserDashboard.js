import React,{ useState,useEffect}from 'react'
import Layout from './../core/Layout';
import { isAuthenticated } from './../auth';
import { Link } from 'react-router-dom';
import {getPurchaseHistroy} from "./apiUser";
import moment from "moment";

const UserDashboard = ()=>{
    const [history, setHistory] = useState([]);
    const {
        user: { _id, name, email, role },token
    } = isAuthenticated();

    const init = (userid,token)=>{
        getPurchaseHistroy(userid,token)
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setHistory(data);
            }
        })
    }
    useEffect(()=>{
        init(_id,token);
    },[]);
    const userLinks = ()=>{
        return(
            <div className="card">
                <h3 className="card-header">
                    User Links
                </h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/cart">Cart</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to={`/profile/${_id}`}>Update Profile</Link>
                    </li>
                </ul>
            </div>
        )
    }
    const userInfo = ()=>{
        const {name,email,role} = isAuthenticated().user;
        return (
            <div className="card mb-5">
                <h3 className="card-header">
                    User Information
                </h3>
                <ul className="list-group">
                    <li className="list-group-item"><h5>Name</h5> {name}</li>
                    <li className="list-group-item"><h5>Email</h5> {email}</li>
                    <li className="list-group-item"><h5>Role</h5> {role===0?"User":"Admin"}</li>
                </ul>
            </div>
        )
    }
    const details = (key,value,place)=>{
        return place==="out"?
            <><p className="text-primary">{key} <span className="text-muted">{value}</span></p> </>
            :<><p className="text-primary">{key} <span className="text-muted">{value}</span></p></>
    }
    const purchaseHistory = ()=>{
        return(
            <div className="card mb-5">
                <h3 className="card-header">Purchase History</h3>
                <ul className="list-group">
                    {
                        history.length>0?
                        <li className="list-group-item">
                            {history.map((pr,i)=>{
                                return (
                                    <div key={i}>
                                        {details("Order Number: ",i+1,"out")}
                                        {details("Purchased Status: ",pr.status,"out")}
                                        {details("Total Ammaount :",""+pr.amount+"/-","out")}
                                        {details("Deleiverd at: ",pr.address,"out")}
                                        <h4><u>Product Purchase by You- </u></h4>
                                        {pr.products.map((prd,idx)=>{
                                            return (
                                                <div key={idx+1}>
                                                    {details("Product Numeber: ",idx+1,"in")}
                                                    {details("Product name: ",prd.name,"in")}
                                                    {details("Product price: ",""+prd.price+"/-","in")}
                                                    {details("Product quantity: ",prd.count,"in")}
                                                    {details("Product Purchased At: ",moment(prd.createdAt).fromNow(),"in")}
                                                    <hr/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </li>
                        :<li className="list-group-item">"No Products Have been Purchased Yet."</li>
                    }
                </ul>
            </div>
        )
    }

    return (
    <Layout title={`Hello ${name}!`} description="Welcome to TradersMania" className="container-fluid">
        <div className="row">
            <div className="col-3">
                {userLinks()}
            </div>
            <div className="col-9">
                {userInfo()}
            </div>
        </div>
        <div>{purchaseHistory()}</div>
    </Layout>
    )
}
export default UserDashboard;