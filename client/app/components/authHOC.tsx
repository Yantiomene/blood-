import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuthStatus, selectAuthStatus } from '../redux/authSlice';

const withAuth = (WrappedComponent: React.FC) => {
  const WrapperComponent: React.FC = (props) => {
    const router = useRouter();

    const dispatch = useDispatch();
    const isAuth = useSelector(selectAuthStatus);
    const isLoading = useSelector((state: any) => state.auth.isLoading);

    useEffect(() => {
      dispatch(initializeAuthStatus() as any);
    }, [dispatch]);

    useEffect(() => {
      if (!isLoading && !isAuth) {
        router.push('/login');
      }
    }, [isAuth, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-[40vh] flex items-center justify-center text-gray-600">
          Checking session...
        </div>
      );
    }

    if (isAuth) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return WrapperComponent;
};

export default withAuth;
