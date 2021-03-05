import React,{useState} from 'react'
import Layout from './../core/Layout';
import { isAuthenticated } from './../auth';
import { Link } from 'react-router-dom';
import { createCategory} from './apiAdmin';

const AddCategory = ()=>{
    const [name,setName] = useState('');
    const [error,setError] = useState(false);
    const [success,setSuccess] = useState(false);
    
    const {user,token} = isAuthenticated();

    const handleChange = (e)=>{
        setError('')
        setSuccess(false);
        setName(e.target.value);
    }

    const clickSubmit = (e)=>{
        e.preventDefault();
        setError('');
        setSuccess(false);
        //make request   
        createCategory(user._id,token,{name})
        .then(data=>{
            if(data.error){
                setError(true);
            }else{
                setError("");
                setSuccess(true);
            }
        })
    }

    const newForm = ()=>(
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name Of Category?</label>
                <input type="text" className="form-control" onChange={handleChange} 
                value={name} 
                autoFocus placeholder="Enter Category Name" required/>
            </div>
            <button className="btn btn-primary">Create Category</button>
        </form>
    )

    const showSuccess = ()=>{
        if(success){
            return <div className="alert alert-info">
                        Category {name} is Created SuccesFully.
                </div>
        }
    };
    const showError = ()=>{
        if(error){
        return <div className="alert alert-danger">
                    Category "{name}" is Already Created, Please Create Another Category.
             </div>
        }
    };
    const goBack = ()=>(
        <div className="mt-5">
            <button className="btn btn-primary">
                <Link to="/admin/dashboard" className="text-white text-decoration-none">
                Back to Dashboard
            </Link></button>
        </div>
    )
    return (
        <Layout title={`Hello ${user.name}!`} description="Ready to Add a Category">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newForm()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    )
}
export default AddCategory;