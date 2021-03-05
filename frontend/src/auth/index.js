export const signup = (user) => {
  return fetch("http://localhost:8000/api/signup", {
    method: "POST",
    headers: {
      Accept: "applications/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return fetch("http://localhost:8000/api/signin", {
    method: "POST",
    headers: {
      Accept: "applications/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};


export const signout = (next)=>{
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
    return fetch("http://localhost:8000/api/signout",{
      method:"GET"
    })
    .then(res=>console.log("SignOut Successfully Done."))
    .catch(err=>console.log(err));
  }
}

export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};
//Local Storge is the property of winodw Object.
export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt"))
    return JSON.parse(localStorage.getItem("jwt"));
  else return false;
};
