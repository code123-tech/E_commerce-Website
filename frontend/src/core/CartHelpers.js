//CRUD Operations on Cart
//1. Reading Cart
export const itemTotal = ()=>{
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart")).length;
        }
    }
    return 0;
}
//2. Create Cart 
export const AddingIntoCart = (cartItem = [],count=0,next = f=>f)=>{
    let myCart = [];
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            myCart = JSON.parse(localStorage.getItem("cart"));
        }
        myCart.push({...cartItem,count:1});
        //Remove Duplicates than Insert
        myCart = Array.from(new Set(myCart.map(p=>p._id))).map(id=>{
            return myCart.find(p=>p._id === id);
        });
        localStorage.setItem("cart",JSON.stringify(myCart));
        next();
    }
}

//Cart Items(Reac cart)
export const getCartItems = ()=>{
    if(typeof window!==undefined){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart"));
        }
    }
    return [];
}
//3. Update Cart
export const updateCartItem = (prdId,count)=>{
    let myCart = [];
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            myCart = JSON.parse(localStorage.getItem("cart"));
        }
        
        myCart.map((pr,i)=>{
            if(pr._id===prdId)
                myCart[i].count = count;
        });

        localStorage.setItem("cart",JSON.stringify(myCart));
    }
}
//4. Remove Item
export const removeItem = (prdId)=>{
    let myCart = [];
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            myCart = JSON.parse(localStorage.getItem("cart"));
        }
        
        myCart.map((pr,i)=>{
            if(pr._id===prdId)
                myCart.splice(i,1);
        });

        localStorage.setItem("cart",JSON.stringify(myCart));
    }
    return myCart;
}
//Delete EveryThing fromCart
export const EmptyCart = next=>{
    if(typeof window!== undefined){
        localStorage.removeItem("cart");
        next();
    }
}