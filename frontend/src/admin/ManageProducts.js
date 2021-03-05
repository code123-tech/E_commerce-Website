import React,{useState,useEffect} from 'react'
import Layout from './../core/Layout';
import {getProductList,deleteProduct} from "./apiAdmin";
import { isAuthenticated } from './../auth';
import { Link, Redirect } from 'react-router-dom';

 const ManageProducts = ()=>{
    const [products,setProducts] = useState([]);
    const [error,setError] = useState(false);
    const {user,token} = isAuthenticated();

    const loadProducts = ()=>{
        getProductList().then(data=>{
            if(!data){
                setError(true);
            }else{
                setProducts(data.products);
            }
        })
    }
    //Delete Produc
    const destroyProduct = (productId)=>{
        deleteProduct(productId,user._id,token)
            .then(data=>{
                if(!data){
                    console.log("Error in Fetching Data");
                }else{
                    loadProducts();
                }
            })
    }
    useEffect(()=>{
        loadProducts();
    },[]);

    return (
        <Layout title="Your Products" description="Manage Your All Products Here" className="container-fluid">
            {products&&(<><div className="row">
                <div className="col-12">
                    <h2 className="text-center text-primary"><u>Total Products: {products.length}</u></h2>
                    <hr/>
                    <ul className="list-group">
                        {products.map((p, i) => (
                            <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <Link to={`/product/${p._id}`}><strong>{p.name}</strong></Link>
                                <Link to={`/admin/product/update/${p._id}`}>
                                    <span className="badge badge-warning badge-pill">
                                        Update
                                    </span>
                                </Link>
                                <span
                                    onClick={() => destroyProduct(p._id)}
                                    className="badge badge-danger badge-pill"
                                    style={{cursor:"pointer"}}
                                >
                                    Delete
                                </span>
                            </li>
                        ))}
                    </ul>
                    <br />
                </div>
            </div>
            {error&&<Redirect to="/error" />}</>)
            }
        </Layout>
    )
}
export default ManageProducts;