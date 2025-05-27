import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './Pages/BookList';
import Logs from './Pages/Logs'
// import MapComponent from './Locations/MapComponent';
import Navigation from './Pages/Navigation'; 




function App() {
  return (
    <Router>
      {/* <MapComponent /> */}
      <Navigation />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/pages/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;
