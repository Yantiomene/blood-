import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, validateAuthStatus } from '../redux/userSlice';
import Loader from '../components/loader';
// import { LOGINROUTE } from '../api';

const AuthRequired = (WrappedComponent) => {
    return function AuthRequiredWrapper(props) {
        const dispatch = useDispatch();
        // const router = useNavigate();
        const isLoggedin = useSelector(validateAuthStatus);
        const isLoading = useSelector(state => state.user.loading);

        useEffect(() => {
            if (isLoggedin) {
                dispatch(fetchCurrentUser());
            }
            //  else {
            //     router(LOGINROUTE);
            // }
        }, [isLoggedin, dispatch]);

        if (isLoading) {
            return (
                <div
                    className="rounded-md mt-[20vh] w-[80vw] h-[60vh] mx-auto bg-white text-center flex items-center justify-center"
                ><Loader size="50px" />
                </div>
            )
        } else {
            return <WrappedComponent {...props} />;
        }
    };
};

export default AuthRequired;
