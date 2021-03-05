import React,{useState,useEffect} from 'react'
import Layout from './../core/Layout';
import { isAuthenticated } from './../auth';
import { Link,Redirect } from 'react-router-dom';
import { createProduct,getSingleProduct, getCategories, updateProduct} from './apiAdmin';

const AddProduct = ({match})=>{
    const [categories,setCategories] = useState([]);
    const [values,setValues] = useState({
        name:'',
        description:'',
        price:'',
        category:'',
        quantity:'',
        shipping:'',
        photo:'',
        loading:false,
        error:'',
        createdProduct:'',
        redirectToProfile:false,
        formData:new FormData()
    });
    const {user,token} = isAuthenticated();

    const {
        name,
        description,
        price,
        quantity,
        loading,
        error,
        createdProduct,
        formData,
        redirectToProfile
    } = values;

    // loading Categorie
    const init = ()=>{
        // console.log(values);
        return getCategories().then(data=>{
            if(data.error){
                setValues({...values,error:data.error});
            }else{
                setCategories(data);
            }
        });
    }
    const initPrd = (productId)=>{
         getSingleProduct(productId).then(data => {
            if (!data) {
                setValues({ ...values, error: "Error in Getting Product" });
            } else {
                // populate the state
                return setValues({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    shipping: data.shipping,
                    quantity: data.quantity,
                    formData: new FormData(),
                });
                // load categories
            }
        });
    }
    useEffect(()=>{
        if(!match.params.productId)
            init();
        else{
            init();
            initPrd(match.params.productId);
        }
        // eslint-disable-next-line
    },[]);

    
    const handleChange = name=>event=>{
        setValues({...values,error:"",createdProduct:""});
        const value = name==='photo'?event.target.files[0]:event.target.value;
        formData.set(name,value);
        setValues({...values,[name]:value});
    };

    const clickSubmit = (e)=>{
        e.preventDefault();
        setValues({...values,error:'',loading:true});
        if(!match.params.productId){
            createProduct(user._id,token,formData).then(data=>{
                if(data.error){
                    setValues({...values,error:data.error});
                }  else{
                    setValues({
                        ...values,
                        name:'',
                        photo:'',
                        description:'',
                        price:'',
                        quantity:'',
                        loading:false,
                        createdProduct:data.result.name
                    });
                }
            });
    }else{
        
        updateProduct(match.params.productId, user._id, token, formData).then(data => {
            if (!data) {
                setValues({ ...values, error: "Error in Fetching, Check Internet Connection" });
            } else {
                setValues({
                    ...values,
                    name: '',
                    description: '',
                    photo: '',
                    price: '',
                    quantity: '',
                    loading: false,
                    error: false,
                    redirectToProfile: true,
                    createdProduct: data.name
                });
            }
        });
    }
}
    

    const newForm = ()=>(
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Add Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" accept="image/*"/> 
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" onChange={handleChange('name')} className="form-control" value={name}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <input type="text" onChange={handleChange('description')} className="form-control" value={description}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input type="number" onChange={handleChange('price')} className="form-control" value={price}/>
            </div>
            
            <div className="form-group">
                 <label className="text-muted">Category</label>
                 <select onChange={handleChange('category')} className="form-control">
                    <option>Please Select Category</option>
                    {categories&&
                    categories.map((c,i)=>(
                        <option key={i} value={c._id}>{c.name}</option>
                    ))}
                 </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                 </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input type="number" onChange={handleChange('quantity')} className="form-control" value={quantity}/>
            </div>

            <button className="btn btn-primary">{!match.params.productId?"Create Product":"Update Product"}</button>
        </form>
    );

    const showSuccess = ()=>(
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h2>{`${createdProduct}`} {!match.params.productId?"is created Successfully Done!":"is updated!"}</h2>
        </div>
    );
    const showError = ()=>(
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );
    const showLoading = ()=>(
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        )
    )
    const goBack = ()=>(
        <div className="mt-5">
            <button className="btn btn-primary">
                <Link to="/admin/dashboard" className="text-white text-decoration-none">
                Back to Dashboard
            </Link></button>
        </div>
    )
    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return <Redirect to="/" />;
            }
        }
    };
    return (
        <Layout title={`Hello ${user.name}!`} description={!match.params.productId?"Ready to add a new Product":"Ready to Update an exisiting Product"} className="container-fluid">
            <div className="row" style={{marginRight:"0px"}}>
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newForm()}
                    {goBack()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    )
}
export default AddProduct;