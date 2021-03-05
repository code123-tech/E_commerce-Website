import React, { useState } from "react";
import Layout from "../core/Layout";
import { Redirect, Link } from "react-router-dom";
import { signin,isAuthenticated,authenticate} from "../auth";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToReffer: false,
  });

  const { email, password, error, loading, redirectToReffer } = values;
  const {user} = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data,()=>{
            setValues({
              ...values,
              redirectToReffer: true,
            });
        });
      }
    });
  };

  const signinForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Passsword</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading....</h2>
      </div>
    );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const redirectUser = () => {
    if (redirectToReffer) {
        if(user && user.role===1){
            return <Redirect to="/admin/dashboard" />
        }else{
          return <Redirect to="/user/dashboard" />
        }
    }
    if(isAuthenticated())
      return <Redirect to = "/" /> ;
  };

  return (
    <Layout
      title="Signin Page"
      description="Welcome to TradersMania"
      className="container col-md-8 offset-md-2">
      {showLoading()}
      {showError()}
      {signinForm()}
      {redirectUser()}
      <h6>
        Don't Have a Account? <Link to="/signup">Signup</Link>
      </h6>
    </Layout>
  );
};

export default Signin;
