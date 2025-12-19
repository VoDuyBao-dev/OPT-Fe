import {
     EBooks, Profile,
    RegisterTutor, RegisterLearner
} from '~/pages'
//Dashboard
import Dashboard from '~/pages/dashboard/Dashboard';
//Account pages

import LoginPage from '~/pages/account/login/Login';
import ForgotPassword from '~/pages/account/login/ForgotPassword'; 
import OTP from '~/pages/account/login/OTP';
import NewPassword from '~/pages/account/login/NewPassword';

//Leaner pages
import TutorList from '~/pages/learner/TutorList/TutorList';
import TutorDetail from '~/pages/learner/TutorDetail/TutorDetail';
import Schedule from '~/pages/learner/schedule/Schedule';

import ContactPage from '~/pages/learner/contact/Contact';
//tutor pages
import TutorHome from '~/pages/tutor/home/TutorHome';
import TutorSchedule from '~/pages/tutor/schedule/TutorSchedule';
import ParentRequest from '~/pages/tutor/parentRequest/ParentRequest';
import TutorProfile from '~/pages/tutor/tutorProfile/TutorProfile';
import { Classed, Request } from '~/pages/learner';

//admin pages
import TutorManagement from '~/pages/admin/QLUser/tutor/TutorManagement';
import LearnerManagement from '~/pages/admin/QLUser/learner/LearnerManagement';
import AdminProfile from '~/pages/admin/profile/AdminProfile';
import AdminDashboard from '~/pages/admin/dashboard/AdminDashboard';
import AdminEBooks from '~/pages/admin/e-books/AdminEbooks';
import ChatPage from '~/pages/chat/chat/ChatPage';

const publicRouter = [
    {path: '/Login', element: <LoginPage/>},
    {path: '/ForgotPassword', element: <ForgotPassword/>},
    {path: '/OTP', element: <OTP/>},
    {path: '/NewPassword', element: <NewPassword/>},
    {path: '/register/tutor', element: <RegisterTutor/> },
    {path: '/register/learner', element: <RegisterLearner/>},
    {path: '/', element: <Dashboard/>},
    {path: '/EBooks', element: <EBooks/>},
    {path: '/Tutor', element: <TutorList/>},
    {path: '/Tutor/:tutorId', element: <TutorDetail/>},
    {path: '/Contact', element: <ContactPage/>},
    

    // bổ xung trang dashboard chung cho tất cả người dùng
]

const learnerRouter = [
    {path: '/Profile', element: <Profile/>},
    {path: '/Classed', element: <Classed/>},
    {path: '/Request', element: <Request/>},
    {path: '/Schedule', element: <Schedule/>},
    {path: "/chat", element: <ChatPage /> },
]

const tutorRouter = [
    {path: '/tutor/home', element: <TutorHome/>},// sửa lại profile tutor to lên,( xử lý điều hướng) 
    {path: '/tutor/schedule', element: <TutorSchedule/>},
    {path: '/tutor/parent-requests', element: <ParentRequest/>},
    {path: '/tutor/profile', element: <TutorProfile/>},
    {path: '/chat', element: <ChatPage /> }
];

const adminRouter = [
    {path: '/admin/dashboard', element: <AdminDashboard/>},
    {path: '/admin/profile', element: <AdminProfile/>},
    {path: '/admin/tutor-management', element: <TutorManagement/>},
    {path: '/admin/learner-management', element: <LearnerManagement/>},
    {path: '/admin/e-books', element: <AdminEBooks/>}
];
export {learnerRouter, publicRouter, tutorRouter, adminRouter};