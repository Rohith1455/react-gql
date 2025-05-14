import './App.css';
import BookList from './Pages/BookList';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Logs from './Pages/Logs'; 

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <Link className="navbar-brand"  to="/">Book Manager</Link>
        <div className="ms-auto">
          <Link className="btn btn-outline-secondary" to="/pages/logs">Logs</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/pages/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}


export default App;
