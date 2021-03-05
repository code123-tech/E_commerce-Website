import React,{useState,useEffect} from 'react'
import Layout from './Layout';
import { read,related } from './ApiHome';
import moment from "moment";
import Card from './Card';
import { Redirect } from 'react-router-dom';
import { AddingIntoCart } from './CartHelpers';


const  Product = (props)=>{
    const [product,setProduct] = useState({});
    const [relatedProduct,setRelatedProduct] = useState([]);
    const [error,setError] = useState(false);
    const [redirect,setRedirect] = useState(false);

    const loadProduct = (productId)=>{
        read(productId).then(data=>{
            if(!data || data.error)
                setError(data.error);
            else{
                setProduct(data);
                related(productId).then(data1=>{
                    if(!data1 || data1.error)
                        {setError(data1.error);
                            console.log(error);}
                    else
                        setRelatedProduct(data1)
                })  
            }
        });
    }
    useEffect(()=>{
        loadProduct(props.match.params.productId);
    },[props])

    const addToCart = ()=>{
        AddingIntoCart(product,setRedirect(true));
     }
    const cardDetails = (productDetail)=>(
        <div className="card mb-3 border-warning text-center" style={{maxWidth: "800px",margin:"10px auto"}}>
            <div className="row no-gutters">
                <div className="col-md-4">
                    <img src={`http://localhost:8000/api/product/photo/${productDetail._id}`} className="card-img" alt="..."/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h4 className="card-text text-primary"><u>{productDetail.name}</u></h4>
                        <p className="card-text"><u className="text-primary">Description:</u>   {productDetail.description}</p>
                        <p className="card-text"><u className="text-primary">Category:</u>   {productDetail.category.name}</p>
                        <p className="card-text"><u className="text-primary">Price:</u>   {productDetail.price}/-</p>
                        <p className="card-text">
                            <u className="text-primary">Already Sold: </u> 
                            {productDetail.sold}
                        </p>
                        <p className="card-text"><u className="text-primary">Delivery:</u>   {productDetail.shipping?"Avaliable (10/- Extra at the time of Delivery)":"Not Available"}</p>
                        <p><u className="text-primary">Created:</u> {moment(productDetail.createdAt).fromNow()}</p>
                        <span className="badge badge-pill badge-primary">{productDetail.quantity>0?"In Stock":"Not In Stock"}</span>
                        <button onClick={addToCart} className="btn btn-outline-warning mb-2 mt-2 ml-2">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <Layout title={product.name} description={product.description} className="container-fluid">
            {product && product.description && cardDetails(product)}
            <h2 className="text-center text-primary">Related Products</h2>
            <div className="row">
                {relatedProduct && relatedProduct.map((pr,i)=>(<Card key={i} product={pr}/>))}
            </div>
            {redirect&&(<Redirect to="/cart" />)}
        </Layout>
    )
}
export default Product;




//To get Parameter Value 
//https://stackoverflow.com/questions/35352638/react-how-to-get-parameter-value-from-query-string
//Convert Date into human readable Format
//https://stackoverflow.com/questions/58178615/how-can-i-convert-date-time-into-human-readable-form-in-react