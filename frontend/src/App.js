import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/About';
import BlogPage from './pages/Blog';
import BlogDetailPage from './pages/BlogDetailPage';
import WithHeader from './layouts/withHeader';
import WithoutHeader from './layouts/withoutHeader';

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
      {/* pages without headers */}
      <Route path={HOMEROUTE} element={<WithHeader><Home /></WithHeader>} />
      <Route path={LOGINROUTE} element={<WithoutHeader><LoginPage /></WithoutHeader>} />
      <Route path={REGISTERROUTE} element={<WithoutHeader><RegisterPage /></WithoutHeader>} />
      <Route path={VERIFYACCOUNT} element={<WithoutHeader><VerifyAccount /></WithoutHeader>} />
      <Route path={PROFILEROUTE} element={<WithoutHeader><ProfilePage /></WithoutHeader>} />
      <Route path={LOGOUTROUTE} element={<WithoutHeader><LogoutPage /></WithoutHeader>} />
      {/* pages with headers */}
      <Route path={DASHBOARDROUTE} element={<WithHeader><DashboardPage /></WithHeader>} />
      <Route path={ABOUTROUTE} element={<WithHeader><AboutPage /></WithHeader>} />
      <Route path={BLOGROUTE} element={<WithHeader><BlogPage /></WithHeader>} />
      <Route path={`${BLOGDETAILROUTE}/:blogID`} element={<WithHeader><BlogDetailPage /></WithHeader>} />
    </Routes>
  </Router>
);

export default App;
