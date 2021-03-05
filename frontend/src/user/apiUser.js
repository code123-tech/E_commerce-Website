export const read = (userid,token)=>{
    return fetch(`http://localhost:8000/api/user/${userid}`,{
        method:"GET",
        headers:{
            Accept: "applications/json",
            'Content-Type': 'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    .then(res=>res.json())
    .catch(err=>console.log("Error in Fetching User Details"));
}

export const update = (userid,token,user)=>{
    return fetch(`http://localhost:8000/api/user/${userid}`,{
        method:"PUT",
        headers:{
            Accept: "applications/json",
            'Content-Type': 'application/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(user)
    })
    .then(res=>res.json())
    .catch(err=>console.log("Error in Updating User Details"));
}

export const updateUser = (user,next)=>{
    if(typeof window!=="undefined"){
        if(localStorage.getItem("jwt")){
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            localStorage.setItem("jwt",JSON.stringify(auth));
            next();
        }
    }
}
export const getPurchaseHistroy = (userid,token)=>{
    return fetch(`http://localhost:8000/api/orders/by/user/${userid}`,{
        method:"GET",
        headers:{
            Accept: "applications/json",
            'Content-Type': 'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    .then(res=>res.json())
    .catch(err=>console.log("Error in Fetching User Details"));
}