import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/About';
import BlogPage from './pages/Blog';
import BlogDetailPage from './pages/BlogDetailPage';

import {
  LOGINROUTE,
  REGISTERROUTE,
  DASHBOARDROUTE,
  HOMEROUTE,
  PROFILEROUTE,
  ABOUTROUTE,
  BLOGROUTE,
  BLOGDETAILROUTE,
  VERIFYACCOUNT,
  LOGOUTROUTE,
} from './api';
import VerifyAccount from './pages/VerifyAccount';
import LogoutPage from './pages/Logout';

const App = () => (
  <Router>
    <Routes>
      <Route path={HOMEROUTE} element={<Home />} />
      <Route path={LOGINROUTE} element={<LoginPage />} />
      <Route path={REGISTERROUTE} element={<RegisterPage />} />
      <Route path={DASHBOARDROUTE} element={<DashboardPage />} />
      <Route path={PROFILEROUTE} element={<ProfilePage />} />
      <Route path={ABOUTROUTE} element={<AboutPage />} />
      <Route path={BLOGROUTE} element={<BlogPage />} />
      <Route path={`${BLOGDETAILROUTE}/:blogID`} element={<BlogDetailPage />} />
      <Route path={VERIFYACCOUNT} element={<VerifyAccount />} />
      <Route path={LOGOUTROUTE} element={<LogoutPage />} />
    </Routes>
  </Router>
);

export default App;
