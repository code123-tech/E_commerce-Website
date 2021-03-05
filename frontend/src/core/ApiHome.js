import queryString from "query-string";

export const getProducts = (sortBy)=>{
    return fetch(`http://localhost:8000/api/products?sortBy=${sortBy}&order=desc&limit=6`,{
      method:"GET"
    })
    .then(res=>res.json())
    .catch((err)=>console.log(err));
};

export const getCategories = ()=>{
  return fetch("http://localhost:8000/api/categories",{
    method:"GET"
  })
  .then(res=>res.json())
  .catch((err)=>console.log(err));
};

export const getFilteredProducts = (skip,limit,filters = {}) => {
  const data = {skip,limit,filters};
  return fetch(`http://localhost:8000/api/products/by/search`, {
    method: "POST",
    headers: {
      Accept: "applications/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const list = (params)=>{
    //For Reducing Complexity of getting object(params) keys and then converting them into query.
    let query = queryString.stringify(params);
    return fetch(`http://localhost:8000/api/products/search?${query}`,{
      method:"GET"
    })
    .then(res=>res.json())
    .catch(err=>console.log(err));
}

export const read = (productId) =>{
  return fetch(`http://localhost:8000/api/product/${productId}`,{
    method:"GET"
  })
  .then(res=>res.json())
  .catch((err)=>console.log(err));
};

export const related = (productId)=>{
  return fetch(`http://localhost:8000/api/products/related/${productId}`,{
    method:"GET"
  })
  .then(res=>res.json())
  .catch((err)=>console.log(err));
}

export const getBraintreeClientToken = (userid,token) => {
  return fetch(`http://localhost:8000/api/braintree/getToken/${userid}`, {
    method: "GET",
    headers: {
      Accept: "applications/json",
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const paymentProcess = (userid,token,paymentData) => {
  return fetch(`http://localhost:8000/api/braintree/payment/${userid}`, {
    method: "POST",
    headers: {
      Accept: "applications/json",
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`
    },
    body:JSON.stringify(paymentData)
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const createOrder = (userid,token,createOrderData)=>{
  return fetch(`http://localhost:8000/api/order/create/${userid}`,{
    method: "POST",
    headers: {
      Accept: "applications/json",
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`
    },
    body:JSON.stringify({order:createOrderData})
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

//query-string = https://www.npmjs.com/package/query-string