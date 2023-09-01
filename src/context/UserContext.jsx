/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'

import * as jose from 'jose'

const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
    // Carefully assign the default value because on every refresh
    // this value will be assigned to the global user variable and will determine the routes
    const [user, setUser ] = useState(()=> {
            const accessToken = localStorage.getItem('token');
            // console.log("Access token in userContext.jsx: ", accessToken)
            if(accessToken){
                const decodedToken = jose.decodeJwt(accessToken); // {id, name, email, roleId, statusId, exp, iat}
                console.log("DecodedToken in user Context: ", decodedToken)
                if(decodedToken.exp * 1000 < new Date().getTime()){
                    // Token is expired
                    return null;
                }
                return decodedToken; //{email, exp, iat, id, name, role} => user = decodedToken
            }

            return null;

    });

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;