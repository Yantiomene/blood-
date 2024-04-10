import { Link } from "react-router-dom";
import { HOMEROUTE } from "../api";

const Logo = ({ size }) => {
    if (!size) size = "fit-content";
    return (
        <div className="flex justify-center items-center">
            <Link to={HOMEROUTE}
                className="logo"
                style={{ 'width': size }}
            >
                <p className="text-3xl text-red-500 font-bold">
                    Blood+
                </p>
            </Link>
        </div>
    )
}

export default Logo;