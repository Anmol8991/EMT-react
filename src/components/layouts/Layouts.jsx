import { useMemo, lazy, Suspense } from 'react'
import useAuth from '../../hooks/useAuth'
import Loading from '../loader/Loading.jsx'
import { useUserContext } from '../../hooks/useUserContext'

const Layouts = () => {

    const { authenticated } = useAuth()
    const { user } = useUserContext()

    const AppLayout = useMemo( () => {
        if(authenticated){
            if(user?.statusId === 2){
              return lazy(() => import('./AuthLayout'))
            }
            return lazy(() => import('./DefaultLayout'))
        }
        return lazy(() => import('./AuthLayout'))
    },[authenticated, user])
    // () => {
    //     if(authenticated){
    //         if(user.statusId === 2){
    //           return <AuthLayout />
    //         }
    //         return  <DefaultLayout />
    //     }
    //     return <AuthLayout />
    // }
    

  return (
    <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading />
                </div>
            }
        >
            <AppLayout />
        </Suspense>
  )
}

export default Layouts
