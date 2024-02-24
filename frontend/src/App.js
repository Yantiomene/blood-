import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import { useSelector } from "react-redux";


const PrivateRoutes = () => {
  const {isAuth} = useSelector((state) => state.auth);
  return <>{isAuth ? <Outlet /> : <Navigate to="/login" />}</>
}

const RestrictedRoutes = () => {
  const {isAuth} = useSelector((state) => state.auth);

  return <>{isAuth ? <Navigate to="/dashboard" /> : <Outlet />}</>
}

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<PrivateRoutes />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<RestrictedRoutes />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
      </Routes>
    </Router>
  )
}

export default App;