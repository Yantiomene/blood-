import { useSelector } from 'react-redux';
import { selectAuthStatus } from "../redux/authSlice";
import { selectUser } from "../redux/userSlice";
import { VERIFYACCOUNT } from '../api';

const VerifyAlert = () => {
    const isloggedIn = useSelector(selectAuthStatus);
    const user = useSelector(selectUser);
    
    if (!isloggedIn) return;
    return (
        user && !user.isVerified && (
            <div className="bg-red-900 text-white text-center py-2 sticky top-0 z-50">
                <p>Your account is not verified yet. <a href={VERIFYACCOUNT} className='text-red-200 italic underline'>Click</a> to verify now.</p>
            </div>
        )
    );
}

export default VerifyAlert;