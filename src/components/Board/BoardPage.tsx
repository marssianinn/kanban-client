import React, { useEffect } from 'react';
import {useAppDispatch, RootState, useAppSelector} from '../../redux/store';
import { fetchBoards } from '../../redux/boardSlice';
import Column from './Column';
import { Link } from 'react-router-dom';

const BoardPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const boards = useAppSelector((state: RootState) => state.board.boards);
    const loading = useAppSelector((state: RootState) => state.board.loading);
    const error = useAppSelector((state: RootState) => state.board.error);

    useEffect(() => {
        dispatch(fetchBoards());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1>Boards</h1>
            <Link to="/create-board" className="btn btn-primary">Create New Board</Link>
            {boards.map((board) => (
                <div key={board.id} className="board">
                    <h2>{board.title}</h2>
                    <div className="row">
                        {board.columns.map((column) => (
                            <Column key={column.id} boardId={board.id} column={column} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BoardPage;
