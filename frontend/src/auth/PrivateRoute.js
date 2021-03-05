import React from "react";
import { isAuthenticated } from './index';
import { Route,Redirect } from 'react-router-dom';

const PrivateRoute = ({component:Component,...rest})=>(
    <Route 
        {...rest}
        render={props =>
                isAuthenticated()?
                (
                    <Component {...props} />
                ):
                (
                    <Redirect to={{pathname:"/signin",state:{from:props.location}}}/>
                )
            }
        />
)
export default PrivateRoute;




//https://reactrouter.com/web/example/auth-workflow (Private Route Examples)