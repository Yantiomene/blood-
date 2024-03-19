import { useSelector } from 'react-redux';
import { selectAuthStatus } from "../redux/authSlice";
import { selectUser } from "../redux/userSlice";
import { VERIFYACCOUNT } from '../api';

const VerifyAlert = () => {
    const user = useSelector(selectUser);
    const isloggedIn = useSelector(selectAuthStatus);

    return (
        isloggedIn && user && !user.isVerified && (
            <div className="bg-red-900 text-white text-center py-2">
                <p>Your account is not verified yet. <a href={VERIFYACCOUNT} className='text-red-200 italic underline'>Verify</a> to verify now.</p>
            </div>
        )
    );
}

export default VerifyAlert;