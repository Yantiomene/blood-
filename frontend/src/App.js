import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import UserProfile from './pages/UserProfile';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import {
  LOGINROUTE,
  REGISTERROUTE,
  DASHBOARDROUTE,
  HOMEROUTE,
  PROFILEROUTE
} from './api';


const App = () => (
  <Router>
    <Routes>
      <Route path={HOMEROUTE} element={<Home />} />
      <Route path={LOGINROUTE} element={<LoginPage />} />
      <Route path={REGISTERROUTE} element={<RegisterPage />} />
      <Route path={DASHBOARDROUTE} element={<DashboardPage />} />
      {/* <Route path={PROFILEROUTE} element={<ProfilePage />} /> */}
    </Routes>
  </Router>
);

export default App;