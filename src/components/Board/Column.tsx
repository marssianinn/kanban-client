import React from 'react';
import {RootState, useAppSelector} from '../../redux/store';
import { Task } from '../../redux/boardSlice'; // Импорт интерфейса Task
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

interface ColumnProps {
    boardId: number;
    column: {
        id: number;
        title: string;
        taskIds: number[];
    };
}

const Column: React.FC<ColumnProps> = ({ boardId, column }) => {
    const tasks = useAppSelector((state: RootState) =>
        column.taskIds.map((taskId) =>
            state.board.boards.find((board) => board.id === boardId)?.tasks.find((task) => task.id === taskId)
        ).filter(Boolean) as Task[]
    );

    const [, drop] = useDrop({
        accept: ItemTypes.TASK,
        drop: (item: { taskId: number }) => {
            // Handle task drop logic
            console.log(`Task ${item.taskId} dropped in column ${column.id}`);
            // Добавьте свою логику здесь, например, перемещение задачи
        },
    });

    return (
        <div ref={drop} className="column">
            <h3>{column.title}</h3>
            {tasks.map((task) => (
                <div key={task.id} className="task">
                    {task.title}
                </div>
            ))}
        </div>
    );
};

export default Column;
