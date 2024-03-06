import { useSelector } from "react-redux";
import { selectAuthStatus } from "../redux/authSlice";

const Home = () => {
    const isAuthenticated = useSelector(selectAuthStatus);
    return <div className="text-4xl center text-red-500 font-bold text-center">
            <h1>Home Page</h1>
            <p>{isAuthenticated ? "Welcome to the app" : "Please login"}</p>
      </div>;
};
  
export default Home;