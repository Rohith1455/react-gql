import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, REGISTER_USER, UPDATE_USER, DELETE_USER } from '../Queries/queries';
import { useSelector } from 'react-redux';

function UsersPage() {
    const { data, loading, error, refetch } = useQuery(GET_USERS);
    const [addUser] = useMutation(REGISTER_USER);
    const [updateUser] = useMutation(UPDATE_USER);
    const [deleteUser] = useMutation(DELETE_USER);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editUsername, setEditUsername] = useState('');
    const [editIsAdmin, setEditIsAdmin] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const theme = useSelector(state => state.theme.mode);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading users.</p>;

    const handleAddUser = async (e) => {
        e.preventDefault();
        await addUser({ variables: { username, password, isAdmin } });
        setUsername('');
        setPassword('');
        setIsAdmin(false);
        setShowAddForm(false);
        refetch();
    };

    const handleUpdateUser = async (id) => {
        await updateUser({ variables: { id, username: editUsername, isAdmin: editIsAdmin } });
        setEditingId(null);
        refetch();
    };

    return (
        <div className={`container mt-4 rounded ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <h3>User Management</h3>

            <button className="btn btn-outline-success mb-3" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Hide Add Form' : 'Add New User'}
            </button>

            {showAddForm && (
                <form onSubmit={handleAddUser} className="mb-4">
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-2 form-check mt-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={isAdmin}
                                onChange={() => setIsAdmin(!isAdmin)}
                            />
                            <label className="form-check-label">Admin</label>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Add</button>
                        </div>
                    </div>
                </form>
            )}

            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Is Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                                {editingId === user.id ? (
                                    <input
                                        className="form-control"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                    />
                                ) : (
                                    user.username
                                )}
                            </td>
                            <td>
                                {editingId === user.id ? (
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={editIsAdmin}
                                        onChange={() => setEditIsAdmin(!editIsAdmin)}
                                    />
                                ) : (
                                    user.isAdmin ? 'Yes' : 'No'
                                )}
                            </td>
                            <td>
                                {editingId === user.id ? (
                                    <>
                                        <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdateUser(user.id)}>Save</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {
                                                setEditingId(user.id);
                                                setEditUsername(user.username);
                                                setEditIsAdmin(user.isAdmin);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => setUserToDelete(user)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {userToDelete && (
                <>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
                    <div className="modal show fade d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={() => setUserToDelete(null)}></button>
                                </div>
                                <div className="modal-body">
                                    Are you sure you want to delete <strong>{userToDelete.username}</strong>?
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setUserToDelete(null)}>Cancel</button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={async () => {
                                            await deleteUser({ variables: { id: userToDelete.id } });
                                            setUserToDelete(null);
                                            refetch();
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default UsersPage;
