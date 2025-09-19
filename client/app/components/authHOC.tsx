import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuthStatus, selectAuthStatus } from '../redux/authSlice';

const withAuth = (WrappedComponent: React.FC) => {
  const WrapperComponent: React.FC = (props) => {
    const router = useRouter();

    const dispatch = useDispatch();
    const isAuth = useSelector(selectAuthStatus);

    useEffect(() => {
      dispatch(initializeAuthStatus() as any);
    }, [dispatch]);

    useEffect(() => {
      if (!isAuth) {
        router.push('/login');
      }
    }, [isAuth, router]);

    // Render the wrapped component if the user is authenticated
    if (isAuth) {
      return <WrappedComponent {...props} />;
    } else {
      // Return null if the user is not authenticated (the navigation will handle redirection)
      return null;
    }
  };

  return WrapperComponent;
};

export default withAuth;
