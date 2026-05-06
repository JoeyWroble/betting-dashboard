import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Scores from './pages/Scores';
import Odds from './pages/Odds';
import Matchup from './pages/Matchup';
import Tracker from './pages/Tracker';

function App() {
  return (
    <BrowserRouter>
      <div style = {{paddingBottom: '70px'}}>
        <Routes>
          <Route path = "/" element = {<Scores />} />
          <Route path = "/odds" element = {<Odds />} />
          <Route path = "/matchup/:gameId" element = {<Matchup />} />
          <Route path = "/tracker" element = {<Tracker />} />
        </Routes>
      </div>
      <NavBar />
    </BrowserRouter>
  );
}

export default App;