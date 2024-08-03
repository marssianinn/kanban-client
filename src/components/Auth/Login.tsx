import React from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../redux/store';
import { login } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const { register, handleSubmit } = useForm<{ email: string; password: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: { email: string; password: string }) => {
        console.log(data)
        try {
            console.log(data)
            await dispatch(login(data));
            navigate('/boards');
        } catch (error) {
            console.error('Login Error:', error);
            // Возможно, вы захотите показать пользователю сообщение об ошибке
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        {...register('email', { required: true })}
                        className="form-control"
                        id="email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        {...register('password', { required: true })}
                        className="form-control"
                        id="password"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <a onClick={() => navigate('/register')}>Register</a>
        </div>
    );
};

export default Login;
