import React, { ReactNode} from 'react';
import { Navigate } from 'react-router-dom';

import { useWallet } from '../../store/wallet';

export interface IAuthRouteProps {
    children: ReactNode, 
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = ({children}) => {
    const { wallet, isLoading } = useWallet();

    if (!isLoading && !wallet) {
        console.info('Unauthorized, redirecting.');

        return <Navigate to="/" replace={true} />;
    } else {
        return <>{children}</>
    }
}

export default AuthRoute;