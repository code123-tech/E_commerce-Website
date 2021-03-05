import React from 'react'
import Layout from './../core/Layout';
import { isAuthenticated } from './../auth';
import { Link } from 'react-router-dom';


const adminLinks = ()=>{
    return(
        <div className="card">
            <h3 className="card-header">
                Admin Links
            </h3>
            <ul className="list-group">
                <li className="list-group-item">
                    <Link className="nav-link" to="/create/category">Create Category</Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/create/product/">Create Product</Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/order/list">View Products</Link>
                </li>
                <li className="list-group-item">
                    <Link className="nav-link" to="/manage/products">Manage Products</Link>
                </li>
            </ul>
        </div>
    )
}
const adminInfo = ()=>{
  const {name,email,role} = isAuthenticated().user;
    return (
        <div className="card mb-5">
            <h3 className="card-header">
                Admin Information
            </h3>
            <ul className="list-group">
                <li className="list-group-item"><h5>Name</h5> {name}</li>
                <li className="list-group-item"><h5>Email</h5> {email}</li>
                <li className="list-group-item"><h5>Role</h5> {role===0?"User":"Admin"}</li>
            </ul>
        </div>
    )
}
const AdminDashboard = ()=>{
  const {name} = isAuthenticated().user;
    return (
    <Layout title={`Hello ${name}!`} description="Welcome to TradersMania" className="container-fluid">
        <div className="row">
            <div className="col-3">
                {adminLinks()}
            </div>
            <div className="col-9">
                {adminInfo()}
            </div>
        </div>
    </Layout>
    )
}
export default AdminDashboard;