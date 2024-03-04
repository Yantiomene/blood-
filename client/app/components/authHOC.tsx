import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.FC) => {
  const WrapperComponent: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const isAuth = localStorage.getItem('isAuth');
      if (isAuth !== 'true') {
        router.push('/login');
        return;
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WrapperComponent;
};

export default withAuth;
