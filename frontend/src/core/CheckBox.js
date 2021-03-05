import React,{useState} from 'react'


const  CheckBox = ({categories,fiteredSearch})=>{
    const [checked,setChecked] = useState([]);

    //here we are returning a function to called function, it's a higher order function.
    const handleChange = id=>()=>{
        const currentIndex = checked.indexOf(id);
        const newChecked = [...checked];
        if(currentIndex === -1){
            newChecked.push(id);
        }else{
            newChecked.splice(currentIndex,1);
        }
        setChecked(newChecked);
        fiteredSearch(newChecked);
    }
    return categories.map((c,i)=>(
            <li key={c._id} className="list-unstyled">
                <input onChange = {handleChange(c._id)} value={checked.indexOf(c._id===-1)} type="checkbox" className="form-check-input"/>
                <label className="form-check-label">{c.name}</label>
            </li>
    ));
}
export default CheckBox;