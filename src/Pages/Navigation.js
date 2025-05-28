import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaClipboardList, FaChartBar, FaCog, FaBookOpen, FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { logout } from '../store/authSlice';

function Navigation() {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.theme.mode);

    const location = useLocation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const user = useSelector((state) => state.auth.user);
    console.log("Redux state in nav:", user);

    const state = useSelector(state => state);
    console.log('Full Redux State:', state);


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <nav className="navbar navbar-expand-lg px-3 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
            <Link to="/" className="text-dark d-flex align-items-center text-decoration-none">
                <FaBookOpen size={24} className="me-2" />
            </Link>
            <div className="container-fluid position-relative w-100">

                <div className="position-absolute start-50 translate-middle-x">
                    <Link className="navbar-brand fw-bold text-dark" to="/">Book Manager</Link>
                </div>

                {isAuthenticated && <div className="ms-auto d-flex align-items-center position-relative" ref={dropdownRef}>
                    {location.pathname !== '/' && (
                        <Link className="btn btn-outline-dark me-2" to="/">
                            <FaHome />
                        </Link>
                    )}
                    <button className="btn btn-outline-dark me-2" onClick={() => dispatch(toggleTheme())}>
                        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <button className="btn btn-outline-dark me-2" onClick={() => dispatch(logout())}>
                        Logout
                    </button>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="btn btn-outline-dark d-flex align-items-center"
                            onClick={() => setOpen(!open)}
                        >
                            <FaBars className="me-1" />

                            {user.username}

                        </button>

                        {open && (
                            <div
                                className="position-absolute mt-2 py-2 bg-white shadow rounded border"
                                style={{
                                    right: 0,       // Aligns it to the right of the button
                                    minWidth: '180px',
                                    zIndex: 1000,
                                    maxWidth: '95vw', // Prevents it from going out of screen on small devices
                                    overflow: 'hidden'
                                }}
                            >

                                <Link to="/pages/logs" className="dropdown-item d-flex align-items-center px-3 py-2 text-dark text-decoration-none" onClick={() => setOpen(false)}>
                                    <FaClipboardList className="me-2" /> Logs
                                </Link>
                                {
                                    isAdmin &&
                                    <Link to="/pages/users" className="dropdown-item d-flex align-items-center px-3 py-2 text-dark text-decoration-none" onClick={() => setOpen(false)}>
                                        <FaUsers className="me-2" /> Users
                                    </Link>
                                }
                                <Link to="/pages/stats" className="dropdown-item d-flex align-items-center px-3 py-2 text-dark text-decoration-none" onClick={() => setOpen(false)}>
                                    <FaChartBar className="me-2" /> Statistics
                                </Link>
                                <Link to="/pages/AddBookPage" className="dropdown-item d-flex align-items-center px-3 py-2 text-dark text-decoration-none" onClick={() => setOpen(false)}>
                                    <FaCog className="me-2" /> Settings
                                </Link>

                            </div>
                        )}
                    </div>

                </div>}
            </div>
        </nav>
    );
}

export default Navigation;
