import { Outlet, Navigate } from "react-router-dom";
import useAuthority from '../../hooks/useAuthority';

const AuthorityGuard = (props) => {
  // eslint-disable-next-line react/prop-types
  const { userAuthority, routeAuthority } = props;
  // console.log("user AUTHORITY in Authority Guard: ",userAuthority)
  // console.log("route AUTHORITY in Authority Guard: ", routeAuthority)
  const roleMatched = useAuthority(routeAuthority, userAuthority);
  //   <Navigate to="/access-denied" />
  return roleMatched ? <Outlet/> : <h3>Access Denied</h3>
}

export default AuthorityGuard
