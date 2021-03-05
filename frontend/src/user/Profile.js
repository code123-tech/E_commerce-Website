import React,{useState,useEffect} from "react";
import Layout from './../core/Layout';
import { isAuthenticated } from './../auth/index';
import { Redirect} from 'react-router-dom';
import { read,update,updateUser } from "./apiUser";


const Profile = ({match})=>{
    const [values,setValues] = useState({
        name:"",
        email:"",
        password:"",
        error:false,
        success:false
    });
    const {token} = isAuthenticated();
    const user = isAuthenticated() && isAuthenticated().user;
    const {name,email,password,error,success} = values;

    const init = userid=>{
        read(userid,token)
            .then(data=>{
                if(!data){
                    setValues({...values,error:true});
                }else{
                    setValues({ ...values, name: data.name, email: data.email });
                }
            });
    }
    useEffect(()=>{
        init(match.params.userid);
    },[]);

    const handleChange = name=>e=>{
        setValues({...values,error:false,[name]:e.target.value});
    }

    const clickButtonUpdate = event=>{
        event.preventDefault();
        update(match.params.userid,token,{name,email,password})
            .then(data=>{
                if(data.error){
                    setValues({...values,error:data.error});
                }
                else{
                    updateUser(data,()=>{
                        setValues({
                            ...values,
                            name:data.name,
                            email:data.email,
                            success:true
                        });
                    });
                }
            })
    }

    const redirectUser = success=>(
         success&&<Redirect to="/user/dashboard" />
    )
    const showError = error=>{
        return error && <h2 className="text-warning text-center">{error}</h2>
    }
    const prodileUpdate = (name,email,password)=>(
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" onChange={handleChange('name')} className="form-control" value={name}/>
            </div>  
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" onChange={handleChange('email')} className="form-control" value={email}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" onChange={handleChange('password')} className="form-control" value={password}/>
            </div>
            <button onClick={clickButtonUpdate} className="btn btn-primary">
                Submit 
            </button>
        </form>
    )

    return (
        <Layout title={`Hello ${user.name}! See Your Profile`} description="Update Your Profile Here!" className="container-fluid">
            <div style={{padding:"10px"}} className="border border-dark">
                {showError(error)}
                {redirectUser(success)}
                <h2 className="text-center text-primary"><u>Update Profile Here!</u></h2>
                {prodileUpdate(name,email,password)}
            </div>
        </Layout>
    )
}
export default Profile;