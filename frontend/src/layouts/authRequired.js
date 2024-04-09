import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, selectUser } from '../redux/userSlice';

const AuthRequired = (WrappedComponent) => {
    return function AuthRequiredWrapper(props) {
        const dispatch = useDispatch();
        const user = useSelector(selectUser);
        const isLoading = useSelector(state => state.user.loading);

        useEffect(() => {
            // console.log(">> before fetching user from HOC", user);
            if (!user || user.username === '') {
                dispatch(fetchCurrentUser());
                // console.log(">> after fetching user from HOC", user);
            }
        }, [user, dispatch]);

        if (isLoading) {
            return (
                <div
                    className="rounded-lg mb-10 mx-auto bg-white text-center w-[80vw] h-[60vh] flex items-center justify-center"
                >Loading...
                </div>
            )
        } else {
            return <WrappedComponent {...props} currentUser={user} />;
        }
    };
};

export default AuthRequired;
