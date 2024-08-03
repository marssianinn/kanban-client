import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BoardPage from './components/Board/BoardPage';
import CreateBoard from './components/Board/CreateBoard';
import PrivateRoute from './components/Layout/PrivateRoute';

const App: React.FC = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Используем PrivateRoute как обертку для защищенных маршрутов */}
                <Route element={<PrivateRoute />}>
                    <Route path="/boards" element={<BoardPage />} />
                    <Route path="/create-board" element={<CreateBoard />} />
                </Route>

                {/* Перенаправление на boards, если путь не найден */}
                <Route path="*" element={<Navigate to="/boards" />} />
            </Routes>
        </div>
    );
};

export default App;
