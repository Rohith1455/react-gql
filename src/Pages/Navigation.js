import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaClipboardList, FaChartBar, FaCog, FaBookOpen } from 'react-icons/fa';

function Navigation() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

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

                <div className="ms-auto d-flex align-items-center position-relative" ref={dropdownRef}>
                    {location.pathname !== '/' && (
                        <Link className="btn btn-outline-dark me-2" to="/">
                            <FaHome />
                        </Link>
                    )}

                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="btn btn-outline-dark d-flex align-items-center"
                            onClick={() => setOpen(!open)}
                        >
                            <FaBars className="me-1" />
                            Menu
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
                                <Link to="/pages/stats" className="dropdown-item d-flex align-items-center px-3 py-2 text-dark text-decoration-none" onClick={() => setOpen(false)}>
                                    <FaChartBar className="me-2" /> Statistics
                                </Link>
                                <Link to="/pages/settings" className="dropdown-item d-flex align-items-center px-3 py-2 text-dark text-decoration-none" onClick={() => setOpen(false)}>
                                    <FaCog className="me-2" /> Settings
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navigation;
