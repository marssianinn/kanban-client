import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export interface Task {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    executor: string;
    columnId: number;
    boardId: number;
}

export interface CreateBoardData {
    title: string;
    members?: number[];
    columns?: { id: number; title: string; taskIds: number[] }[];
    tasks?: { id: number; title: string; description: string; createdAt: string; executor: string; columnId: number; boardId: number }[];
}
interface Column {
    id: number;
    title: string;
    taskIds: number[];
}

interface Board {
    id: number;
    title: string;
    members: number[];
    columns: Column[];
    tasks: Task[];
}

interface BoardState {
    boards: Board[];
    loading: boolean;
    error: string | null;
}

const initialState: BoardState = {
    boards: [],
    loading: false,
    error: null,
};

export const addBoard = createAsyncThunk<Board, CreateBoardData>(
    'board/addBoard',
    async (newBoard) => {
        const response = await api.post('/boards', newBoard);
        return response.data;
    }
);

// Асинхронные операции
export const fetchBoards = createAsyncThunk<Board[]>(
    'board/fetchBoards',
    async () => {
        const response = await api.get('/boards');
        return response.data;
    }
);

export const createBoard = createAsyncThunk<Board, Omit<Board, 'id'>>(
    'board/createBoard',
    async (newBoard) => {
        const response = await api.post('/boards', newBoard);
        return response.data;
    }
);

export const addTask = createAsyncThunk<Task, Task>(
    'board/addTask',
    async (newTask) => {
        const response = await api.post('/tasks', newTask);
        return response.data;
    }
);

export const updateTask = createAsyncThunk<Task, Task>(
    'board/updateTask',
    async (updatedTask) => {
        const response = await api.put(`/tasks/${updatedTask.id}`, updatedTask);
        return response.data;
    }
);

export const deleteTask = createAsyncThunk<number, number>(
    'board/deleteTask',
    async (taskId) => {
        await api.delete(`/tasks/${taskId}`);
        return taskId;
    }
);

// Срез состояния (slice)
const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Обработка fetchBoards
            .addCase(fetchBoards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBoards.fulfilled, (state, action) => {
                state.loading = false;
                state.boards = action.payload;
            })
            .addCase(fetchBoards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch boards';
            })

            // Обработка createBoard
            .addCase(createBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.boards.push(action.payload);
            })
            .addCase(createBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create board';
            })

            // Обработка addTask
            .addCase(addTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false;
                const { boardId, columnId } = action.payload;
                const board = state.boards.find((b) => b.id === boardId);
                if (board) {
                    const column = board.columns.find((c) => c.id === columnId);
                    if (column) {
                        column.taskIds.push(action.payload.id);
                        board.tasks.push(action.payload);
                    }
                }
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add task';
            })

            // Обработка updateTask
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const { id, boardId } = action.payload;
                const board = state.boards.find((b) => b.id === boardId);
                if (board) {
                    const taskIndex = board.tasks.findIndex((t) => t.id === id);
                    if (taskIndex >= 0) {
                        board.tasks[taskIndex] = action.payload;
                    }
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update task';
            })

            // Обработка deleteTask
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.boards.forEach((board) => {
                    board.tasks = board.tasks.filter((task) => task.id !== action.payload);
                    board.columns.forEach((column) => {
                        column.taskIds = column.taskIds.filter((taskId) => taskId !== action.payload);
                    });
                });
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete task';
            });
    }
});

export default boardSlice.reducer;
