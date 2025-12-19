import { Route, Routes } from 'react-router-dom'
import { learnerRouter, publicRouter, tutorRouter, adminRouter } from './routes'
import { DefaultLayout } from '~/components/layouts/';
import TutorLayout from '~/components/layouts/tutorLayout/TutorLayout';
import AdminLayout from '~/components/layouts/adminLayout/AdminLayout';
import ProtectedRoute from '~/components/login/ProtectedRoute';
import { getUserType } from '~/utils/auth';

function AppRouter() {
    const userType = getUserType(); // 'learner' | 'tutor' | 'admin' | null
    console.log('User type in AppRouter:', userType);
    return (
        //public router
        <Routes>
            {publicRouter.map((item, index) => (
                <Route key={index} path={item.path} element={
                    <DefaultLayout userType={userType || false}>
                        {item.element}
                    </DefaultLayout>
                }></Route>
            ))}
            {/* learner chỉ được vào */}
            {learnerRouter.map((item, index) => (
                <Route key={index} path={item.path} element={
                    <ProtectedRoute allowed={['learner']}>
                        <DefaultLayout userType={userType}>
                            {item.element}
                        </DefaultLayout>
                    </ProtectedRoute>
                }></Route>
            ))}
            {/* tutor chỉ được vào */}
            {tutorRouter.map((item, index) => (
                <Route key={index} path={item.path} element={
                    <ProtectedRoute allowed={['tutor']}>
                        <TutorLayout>
                            {item.element}
                        </TutorLayout>
                    </ProtectedRoute>
                }></Route>
            ))}
            {/* admin chỉ được vào */}
            {adminRouter.map((item, index) => (
                <Route key={index} path={item.path} element={
                    <ProtectedRoute allowed={['admin']}>
                        <AdminLayout>
                            {item.element}
                        </AdminLayout>
                    </ProtectedRoute>
                }></Route>
            ))}
        </Routes>
    )
}
export default AppRouter;