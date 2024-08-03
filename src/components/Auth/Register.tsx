import React from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../redux/store';
import { register as registerUser } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const { register, handleSubmit } = useForm<{ email: string; password: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            await dispatch(registerUser(data));
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            // Handle registration error (e.g., show notification)
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
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
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
