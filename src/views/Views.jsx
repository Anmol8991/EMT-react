import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Loading from "../components/loader/Loading";
import { useUserContext } from "../hooks/useUserContext";
import ProtectedRoute from "../components/route/ProtectedRoute";
import PublicRoute from "../components/route/PublicRoute";
import { protectedRoutes, publicRoutes } from "../config/route.config";
import AuthorityGuard from "../components/route/AuthorityGuard";

const AllRoutes = () => {
  const { user } = useUserContext();
  const userAuthority = user?.roleId;
  // console.log("User Authority in Views.jsx: ", userAuthority);

  return (
    <>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          {protectedRoutes.map((route, index) => {
            // console.log("Routes: ",route.key)
            return (
              <Route
                key={index}
                element={
                  <AuthorityGuard
                    userAuthority={userAuthority}
                    routeAuthority={route.authority}
                  />
                }
              >
                <Route
                  key={route.key}
                  exact path={route.path}
                  Component={() =>{
                    document.title = route.title ? `${route.title} | EMT`: 'EMT'
                    return (
                      <route.component />
                    )
                  }}
                />

              </Route>
            );
          })}
        </Route>
        <Route path="/" element={<PublicRoute />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              Component={route.component}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
};
const Views = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AllRoutes />
    </Suspense>
  );
};

export default Views;
