import useAuthority from "../hooks/useAuthority"

const AuthorityCheck = (props) => {
    const { userAuthority = [], navigationAuthority = [], children } = props
    
    // console.log("Authority in navigation: ",navigationAuthority)
    // console.log("User Authority in navigation: ",userAuthority)
    const roleMatched = useAuthority(navigationAuthority, userAuthority)

    return <>{roleMatched ? children : null}</>
}

export default AuthorityCheck