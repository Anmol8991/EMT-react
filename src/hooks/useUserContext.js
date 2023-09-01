import { useContext } from "react";
import UserContext from "../context/UserContext.jsx";

export const useUserContext = () => useContext(UserContext); //{ user, setUser }

