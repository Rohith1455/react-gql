import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BookList from './Pages/BookList';
import Logs from './Pages/Logs';
import AddBookPage from './Pages/AddBookPage';
import LoginPage from './Pages/LoginPage';
import Navigation from './Pages/Navigation';
import UsersPage from './Pages/UsersPage';



function AppContent() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      {/* {isAuthenticated && <Navigation />} */}
      <Navigation />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <BookList /> : <Navigate to="/login" />} />
        <Route path="/pages/logs" element={isAuthenticated ? <Logs /> : <Navigate to="/login" />} />
        <Route path="/pages/AddBookPage" element={isAuthenticated ? <AddBookPage /> : <Navigate to="/login" />} />
        <Route path="/pages/Users" element={isAuthenticated ? <UsersPage /> : <Navigate to="/login" />} />

      </Routes>
    </>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

