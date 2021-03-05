import React,{useState,useEffect} from 'react';
import {getBraintreeClientToken,paymentProcess,createOrder} from "./ApiHome.js";
import { isAuthenticated } from '../auth';
import {Link} from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import {EmptyCart} from "./CartHelpers";

const CheckOut = ({products,setRun=f=>f,run=undefined})=>{
    const [data,setData] = useState({
        loading:false,
        error:"",
        clientToken:null,
        success:false,
        instance:{},
        address:""
    });
    const userid = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userid,token)=>{
        getBraintreeClientToken(userid,token).then(data1=>{
            if(!data1){
                setData({...data1,error:"Unable To Access Payment method, Please Check Internet Connection."});
                setTimeout(() => {
                    setData({error:""})
                }, 5000);
            }else{
                setData({clientToken:data1.clientToken})
            }
        })
    }

    useEffect(()=>{
        getToken(userid,token);
    },[]);

    const handleAddress = (event)=>{
        setData({...data,address:event.target.value});
    }
    const showCheckOut = ()=>{
        return isAuthenticated()?
            (showDropIn())
            :(<Link to="/signin">
                <button className="btn btn-primary">Sign in to CheckOut</button>
            </Link>);
    };

    //Dropin in Braintree Payment Method
    const showDropIn = ()=>( 
        <div onBlur={()=>{setData({...data,error:""})}}>{
            (data.clientToken !== null && products.length>0)?(
                <div className="col">
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>
                    <div>  
                        <DropIn 
                            options={{authorization:data.clientToken,
                                    paypal:
                                    {flow:"vault"}}}
                            onInstance = {instance=>(data.instance = instance)} />
                        <button onClick={buy} className="btn btn-success btn-primary mb-2">CheckOut</button>
                    </div>
                </div>
            )
            :null}
        </div> 
    );
    //Create Buy Function for Getting nonce and information of card
    let delieveryAddress = data.address;
    const buy = ()=>{
        setData({...data,loading:true});
        //Getting nonce from user and sending into backend
        //nonce = data.instance.requestPaymentMethod
        let nonce;
        let getNonce = data&&data.instance&&data.instance
                       .requestPaymentMethod()
                        .then(data=>{
                            nonce = data.nonce;
                            const paymentData= {
                                paymentMethodNonce:nonce,
                                amount:getTotal()
                            }
                            paymentProcess(userid,token,paymentData)
                            .then(response=>{
                                const createOrderData = {
                                    products:products,
                                    transaction_id:response.transaction.id,
                                    amount: response.transaction.amount,
                                    address:delieveryAddress
                                }
                                createOrder(userid,token,createOrderData)
                                .then(response=>{
                                    EmptyCart(()=>{
                                        setData({loading:false,success:true});
                                        //After 3 seconds Update the Page and Show the success Page
                                        setInterval(() => {
                                            setRun(!run);
                                        }, 3000);
                                    });
                                })
                                .catch(err=>{
                                    setData({loading:false,error:err});
                                    setTimeout(() => {
                                        setData({error:""});
                                    }, 5000);
                                });
                            })
                            .catch(err=>{
                                setData({loading:false});
                            });
                        }).catch(err=>{
                            setData({...data,error:err.message})
                        });
        }

    //Getting Total Ammount
    const getTotal = ()=>{
        return products.reduce((accu,nextVal)=>{
            return accu + nextVal.count*nextVal.price
        },0);
    }
    //For Showing Error
    const showError = error => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );
    //Show Success
    const showSuccess = success => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Your Order has been Received, Thanks For Shopping, Wait For 3 seconds...
        </div>
    );
    const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;
    return (
        <div>
            <h2>Total Price : {getTotal()} /-</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckOut()}
        </div>
    )
}
export default CheckOut;


//Briantree vs Stripe
//https://rubygarage.org/blog/stripe-vs-braintree-vs-paypal-how-do-these-payment-platforms-compare
//Braintree Frontend
//https://dennisokeeffe.com/blog/braintree-node-react
