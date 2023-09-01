import React from 'react'
import { useUserContext } from "./useUserContext.js";
import { useNavigate  } from "react-router-dom";
import * as jose from "jose";

const useAuth = () => {
  const { user, setUser } = useUserContext()
  const navigate = useNavigate();
  let redirectUrl;

  const signIn = (data) => {
    // console.log("Data in useAuth hook: ",data);
    if(data){
      // set the global user data to the the value received in the token
      const accessToken = data?.accessToken;
      localStorage.setItem("token", accessToken);
      const decodedToken = jose.decodeJwt(accessToken); //{ id, name, email, roleId, status, exp, iat,}
      setUser(decodedToken);

      // Navigate to dashboard according to the user role
        if(decodedToken.statusId === 2){
          redirectUrl = "/user/updatePassword";
        }else{
          if (decodedToken.roleId === 1) {
            redirectUrl = "/admin/dashboard";
          } else {
            redirectUrl = "/user/dashboard";
          }
        }

        navigate(redirectUrl);
    }
  }

  const signOut = () => {
    // Set user to null and clear local storage and Protected Route will redirect to the sign-in screen 
    localStorage.clear();
    setUser(null)
  }


  return{
    authenticated: user ? true: false ,
    signIn,
    signOut
  }
}

export default useAuth
