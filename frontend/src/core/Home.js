import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import { getProducts } from './ApiHome';
import Card from "./Card";
import Search from './Search';
import { Redirect } from 'react-router-dom';

 const Home = ()=>{
        const [productBySell,setproductBySell] = useState([]);
        const [productByArrival,setproductByArrival] = useState([]);
        const [error,setError] = useState(false);
        //Loading Products by Sell or Arrival
        const loadProducts = (name)=>{
                getProducts(name).then(data=>{
                        if(!data){ setError(true);
                        }

                        else{
                                if(name==="sold") setproductBySell(data.products);
                                else setproductByArrival(data.products);
                        }
                });
        }
        useEffect(()=>{
              loadProducts('sold');
              loadProducts('createdAt');
        },[])

        const products = (products,accord)=>(
             <>
                <h2 className="mb-4 mt-4 text-center text-primary">{accord==="arrival"?"New Arrivals":"Best Sellers"}</h2>
                <div className="row">
                   {products&&products.map((product)=>(<Card key={product._id} product={product}/>))}
                </div>
             </>
        )
        return(
        <Layout title="Home Page" description="Welcome to TradersMania" className="container">
                <Search />
                {products(productBySell,"arrival")}
                {products(productByArrival,"sell")}
                {error&&(<Redirect to="/error"/>)}
        </Layout>
        );
};

export default Home;
