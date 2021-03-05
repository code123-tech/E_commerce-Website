import React from 'react';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Home from "./core/Home";
import Shop from "./core/Shop";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Product from './core/Product';
import Cart from './core/Cart';
import error from './core/error';
import Order from './admin/order';
import Profile from './user/Profile';
import ManageProducts from './admin/ManageProducts';


export default function Routes() {
    return (
        <Router>
            <Switch>    
                <Route exact path="/" component={Home}/>
                <Route exact path="/shop" component={Shop}/>
                <Route exact path="/signin" component={Signin}/>
                <Route exact path="/signup" component={Signup}/>
                <Route exact path="/create/category" component={AddCategory}/>
                <Route exact path="/create/product" component={AddProduct}/>
                <Route exact path="/product/:productId" component={Product}/>
                <Route exact path="/cart" component={Cart}/>
                <Route exact path="/error" component={error}/>
                <PrivateRoute exact path="/user/dashboard" component={UserDashboard}/>
                <PrivateRoute exact path="/profile/:userid" component= {Profile}/>
                <AdminRoute exact path="/admin/dashboard" component={AdminDashboard}/>
                <AdminRoute exact path="/order/list" component= {Order} />
                <AdminRoute exact path="/manage/products" component= {ManageProducts} />
                <AdminRoute exact path="/admin/product/update/:productId" component= {AddProduct} />
            </Switch>
        </Router>
    )
}