import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'


const useAuthority = (routeAuthority, userAuthority ) => {

    const roleMatched = useMemo(() => {
        if (userAuthority === 1){
            return routeAuthority.some((role) => role === 'admin')
        }else{
            return routeAuthority.some((role) => role === 'user')
        }
        
    }, [routeAuthority, userAuthority])

    // if (
    //     isEmpty(routeAuthority) ||
    //     isEmpty(userAuthority) ||
    //     typeof routeAuthority === 'undefined'
    // ) {
    //     return true
    // }

    return roleMatched

}

export default useAuthority
