import React from 'react'
import "../styles.css";
import Menu from './Menu';

 const Layout = ({title="Title",description="Description",className,children})=>{
    return (
        <div>
            <Menu/>
            <div className="jumbotron">
                <h2>{title}</h2>
                <h3 className="lead">{description}</h3>
            </div> 
            <div className={className}>{children}</div>
        </div>
    )
}
export default Layout;
