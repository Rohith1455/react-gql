import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

// Mutation that returns a token
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password){
    username
    isAdmin
    passwordHash
  }
}
`;


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { loading }] = useMutation(LOGIN_MUTATION);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: { username, password } });

      const user = data?.login;

      if (user) {
        console.log('Logging in with:', user); 
        dispatch(login({
          token: 'mock-token',
          username: user.username,
          isAdmin: user.isAdmin,
        }));


        navigate('/');
      } else {
        setLoginFailed(true); // Shouldn't reach here if server throws on failure
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginFailed(true);
    }
  };


  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginFailed && (
            <div className="alert alert-danger">Login failed. Please check your username and password.</div>
          )}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
