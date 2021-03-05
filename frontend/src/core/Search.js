import React,{useState,useEffect} from 'react';
import { getCategories, list } from './ApiHome';
import Card from './Card';

const Search = ()=>{
    const [data,setData] = useState({
        categories:[],
        category:"",
        search:"",
        results:[],
        searched:false,
    });
    const {categories,category,search,results,searched} = data;

    const loadCategories = ()=>{
        getCategories().then(data=>{
            if(!data)
                setData({searched:false})
            else{
                setData({...data,categories:data});
            }
        });
    }

    useEffect(()=>{
        loadCategories();
    },[]);

    //Change in search and category
    const handleSearch = name=>event=>{
        setData({...data,[name]:event.target.value,searched:false});
    }
    
    //Searching Results make api request and find product according to our searching and sets results
    const searchResults = event=>{
        event.preventDefault();
        if(search){
            list({search,category}).then(data1=>{
                if(data1.err){
                    console.log(data1.err);
                }
                else{
                    setData({...data,results:data1,searched:true});
                }
            });
        }
    }

    //search Message as search gets true
    const searchMessage = (searched,results=[])=>{
        if(searched && results.length>0)
            return (
            <div>
                <h2 className="mt-4 mb-4">
                    Found {results.length} Products
                </h2>
                <div className="row">
                    {results.map((pr,index)=>(
                        <div key={index} className="col-4 mb-3">
                            <Card  product={pr} />
                        </div>
                    ))}
                </div>
            </div>
            )
        else    
            return `No Products Found With Given Name`;
    }

    //Search Form or SearchBar. See Boostrap Form input group classes in DOC and create Beautiful Search Bar.
    const searchForm = ()=>(
        <form onSubmit={searchResults}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleSearch("category")}>
                            <option value="All">Pick Category</option>
                            {categories&&categories.map((cat,index)=>(
                                <option key={index} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>   
                    </div>  
                    <input 
                        type="text"
                        className="form-control"
                        onChange={handleSearch("search")}
                        placeholder="Enter Product Name"
                    />
                </div>
                {/* For Button */}
                <div className="btn input-group-append" style={{border:"none"}}>
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>
    )
    
    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searched?searchMessage(searched,results):""}
            </div>
        </div>
    )
}
export default Search;


