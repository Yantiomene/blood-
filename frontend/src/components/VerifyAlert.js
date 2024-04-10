import { useSelector } from 'react-redux';
import { selectUser, validateAuthStatus } from "../redux/userSlice";
import { VERIFYACCOUNT } from '../api';

const VerifyAlert = () => {
    const isloggedIn = useSelector(validateAuthStatus);
    const user = useSelector(selectUser);
    
    console.log(">> user verfication status: ", user.isVerified);

    if (!isloggedIn) return;
    return (
        user && !user.isVerified && (
            <div className="bg-red-900 text-white text-center py-2 sticky top-0 z-40">
                <p>Your account is not verified yet. <a href={VERIFYACCOUNT} className='text-red-200 italic underline'>Click</a> to verify now.</p>
            </div>
        )
    );
}

export default VerifyAlert;