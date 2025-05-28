import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')), // Should be { username: '...' }
    isAdmin: JSON.parse(localStorage.getItem('isAdmin')),
    isAuthenticated: !!localStorage.getItem('token'),
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = { username: action.payload.username }; // 👈 wrap in object
            state.isAdmin = action.payload.isAdmin;
            state.isAuthenticated = true;

            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify({ username: action.payload.username })); // 👈 store as object
            localStorage.setItem('isAdmin', JSON.stringify(action.payload.isAdmin));
        },

        logout: (state) => {
            state.user = null;
            state.isAdmin = null;
            state.isAuthenticated = false;

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
