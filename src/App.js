import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import BookList from './Pages/BookList';
import Logs from './Pages/Logs'
// import MapComponent from './Locations/MapComponent';


function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/">Book Manager</Link>
      <div className="ms-auto">
        {location.pathname === '/' && (
          <Link className="btn btn-outline-secondary" to="/pages/logs">Logs</Link>
        )}
        {location.pathname === '/pages/logs' && (
          <Link className="btn btn-outline-secondary" to="/">Home</Link>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/pages/logs" element={<Logs />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      {/* <MapComponent /> */}
      <AppContent />
    </Router>
  );
}

export default App;
