import React,{useState,useEffect} from 'react';
import Card from './Card';
import Layout from './Layout';
import { getCategories,getFilteredProducts} from './ApiHome';
import CheckBox from "./CheckBox";
import {PriceRange} from "./PriceRange";
import RadioBox from './RadioBox';
import { Redirect } from 'react-router-dom';

export default function Shop() {
    const [myFilters,setMyFilters] = useState({
        filters:{category:[],price:[]}
    });
    const [categories,setCategories] = useState([]);
    const [error,setError] = useState(false);
    const [skip,setSkip] = useState(0);
    const [size,setSize] = useState(0);
    const [limit,setLimit] = useState(6);
    const [filteredResults,setFilteredResults] = useState([]);

    const init = ()=>{
        getCategories().then(data=>{
            if(!data){
                setError(true);
                    setLimit(6);
            }else{
                setCategories(data);
            }
        });
    };

    //Loading Products Based on Filtering
    const loadFilters = (filters)=>{
        getFilteredProducts(skip,limit,filters).then(data=>{
            if(!data){
                setError(true);
            }else{
                setFilteredResults(data.data);
                setSize(data.size);
                setSkip(0);
            }
        });
    }
    
    useEffect(()=>{
        init();
        loadFilters(myFilters.filters);
        // eslint-disable-next-line
    },[]);

    const handleSearch = (filters,filterby)=>{
        const newFilters = {...myFilters};
        newFilters.filters[filterby] = filters;
        if(filterby === "price"){
            let priceValues = handlePrice(filters);
            newFilters.filters[filterby] = priceValues;
        }
        loadFilters(myFilters.filters);
        setMyFilters(newFilters);
    }

    //Load More Data
    const loadMore = ()=>{
        let toSkip = skip + limit;
        getFilteredProducts(skip,limit,myFilters.filters).then(data=>{
            if(!data){
                setError(true);
            }
            else{
                setFilteredResults([...filteredResults,...data.data]);
                setSize(data.size);
                setSkip(toSkip);
            }
        });
    }

    const handlePrice = fetchedRange=>{
        let priceArray = [];
        for(let key in PriceRange){
            if(PriceRange[key]._id===parseInt(fetchedRange))
                priceArray = PriceRange[key].array;
        }
        return priceArray;
    }
    return (
        <Layout title="Welcome to TradersMania" description="Search Your Favourite Product" className="container-fluid">
            <div className="row">
                <div className="col-2">
                    <h4>Filter By Categories</h4>
                    <ul>
                        <CheckBox categories={categories} fiteredSearch={filters=>handleSearch(filters,'category')}/>
                    </ul>
                    <h4>Filter By Price</h4>
                    <div>
                        <RadioBox prices={PriceRange} handlefilters={filters=>handleSearch(filters,'price')}/>
                    </div>
                </div>
                <div className="col-10">
                    <div className="row justify-content-center">
                    {   
                        filteredResults.length===0?<h2 className="text-center">No Products Available</h2>:
                        filteredResults.map((p,i)=>(
                            <Card key={i} product = {p} />
                        ))
                    }
                    </div>
                    <hr/>
                    {size>0 && size>=limit && (
                        <button onClick={loadMore} className="btn btn-warning mb-5">Load More</button>
                    )}
                </div>
                {error&&(<Redirect to="/error" />)}
            </div>
        </Layout>
    )
}
