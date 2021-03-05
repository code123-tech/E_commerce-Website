//Create Category
export const createCategory = (userId,token,category) => {
    return fetch(`http://localhost:8000/api/category/create/${userId}`, {
      method: "POST",
      headers: {
        Accept: "applications/json",
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify(category),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };
  
//Update Category
export const updateCategory = (categoryId,userid,token,category)=>{
    return fetch(`http://localhost:8000/api/category/${categoryId}/${userid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "applications/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify(category),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
};


//Create Products
export const createProduct = (userId,token,product)=>{
    return fetch(`http://localhost:8000/api/product/create/${userId}`, {
      method: "POST",
      headers: {
        Accept: "applications/json",
        Authorization:`Bearer ${token}`
      },
      body: product,
    })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
//Reading all Categories
export const getCategories = ()=>{
    return fetch("http://localhost:8000/api/categories",{
      method:"GET"
    })
    .then(res=>res.json())
    .catch((err)=>console.log(err));
};
//Getting Single Category
export const getCategory = (categoryId)=>{
  return fetch(`http://localhost:8000/category/${categoryId}`,{
      method:"GET"
    })
    .then(res=>res.json())
    .catch((err)=>console.log(err));
}

//Fetching all Ordered Products by User
export const getProducts = (userid,token)=>{
  return fetch(`http://localhost:8000/api/order/list/${userid}`,{
    method: "GET",
      headers: {
        Accept: "applications/json",
        Authorization:`Bearer ${token}`
    }
  })
  .then(res=>res.json())
  .catch(err=>console.log(err));
}

//Status Values
export const getStatusValues = (userid,token)=>{
  return fetch(`http://localhost:8000/api/order/status-values/${userid}`,{
    method: "GET",
      headers: {
        Accept: "applications/json",
        Authorization:`Bearer ${token}`
    }
  })
  .then(res=>res.json())
  .catch(err=>console.log(err));
}
//Update Status Value
export const updateOrderStatus  = (userId,token,orderId,status)=>{
  return fetch(`http://localhost:8000/api/order/${orderId}/status/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "applications/json",
      'Content-Type': 'application/json',
      Authorization:`Bearer ${token}`
    },
    body: JSON.stringify({status,orderId}),
  })
  .then((res) => res.json())
  .catch((err) => console.log(err));
};

//Now Performing CRUD operations on Products by Admin
//Get products
export const getProductList = ()=>{
  return fetch(`http://localhost:8000/api/products?limit=undefined`, {
    method: "GET",
  })
  .then((res) => res.json())
  .catch((err) => console.log(err));
}
//Delete Product
export const deleteProduct = (productId,userid,token)=>{
  return fetch(`http://localhost:8000/api/product/${productId}/${userid}`, {
    method: "DELETE",
    headers: {
      Accept: "applications/json",
      'Content-Type': 'application/json',
      Authorization:`Bearer ${token}`
    },
  })
  .then((res) => res.json())
  .catch((err) => console.log(err));
}
//Get Single PRoduct
export const getSingleProduct = (productId) =>{
  return fetch(`http://localhost:8000/api/product/${productId}`,{
    method:"GET"
  })
  .then(res=>res.json())
  .catch((err)=>console.log(err));
};
//Update Product
export const updateProduct  = (productId,userId,token,product)=>{
  return fetch(`http://localhost:8000/api/product/${productId}/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "applications/json",
      Authorization:`Bearer ${token}`
    },
    body: product
  })
  .then((res) => res.json())
  .catch((err) => console.log(err));
};
