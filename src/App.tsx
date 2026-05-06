import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Odds from './pages/Odds';
import Matchup from './pages/Matchup';
import Tracker from './pages/Tracker';

function App() {
  return (
    <BrowserRouter>
      <div className="pb-20 min-h-screen" style = {{ backgroundColor: '#111111'}}>
        <Routes>
          <Route path = "/" element={<Home />} />
          <Route path = "/odds" element={<Odds />} />
          <Route path = "/matchup/:gameId" element={<Matchup />} />
          <Route path = "/tracker" element={<Tracker />} />
        </Routes>
      </div>
      <NavBar />
    </BrowserRouter>
  );
}

export default App;