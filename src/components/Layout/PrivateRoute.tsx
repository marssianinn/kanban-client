import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState, useAppSelector } from '../../redux/store';

// Этот компонент защищает маршруты от неавторизованных пользователей
const PrivateRoute: React.FC = () => {
    const token = useAppSelector((state: RootState) => state.auth.token);

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
