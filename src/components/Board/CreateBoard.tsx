import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch } from '../../redux/store';
import {addBoard, CreateBoardData} from '../../redux/boardSlice';
import { useNavigate } from 'react-router-dom';



const CreateBoard: React.FC = () => {
    const { control, handleSubmit } = useForm<CreateBoardData>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: CreateBoardData) => {
        // Подготовьте данные для создания доски
        const newBoard = {
            ...data,
            members: [], // Задайте значения по умолчанию, если это необходимо
            columns: [],
            tasks: []
        };

        // Убедитесь, что addBoard возвращает Promise
        await dispatch(addBoard(newBoard));
        navigate('/boards');
    };



    return (
        <div className="container">
            <h2>Create Board</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => <input {...field} className="form-control" />}
                    />
                </div>
                {/* Добавьте дополнительные поля формы, если необходимо */}
                <button type="submit" className="btn btn-primary">Create Board</button>
            </form>
        </div>
    );
};

export default CreateBoard;
