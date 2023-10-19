import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Navbar from './components/navbar.js';
import Home from './pages/home.js';
import Clock from './pages/clock.js';
import Calculator from './pages/calculator.js'
import TicTacToe from './games/tictactoe.js';
import Footer from './components/footer.js';


function App() {
  return (
    <div id="App">
      <Navbar />
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/apps" element={<Home />} />
          <Route exact path="/apps/clock" element={<Clock />} />
          <Route exact path="/apps/calculator" element={<Calculator />} />
          <Route exact path="/games" element={<Home />} />
          <Route exact path="/games/tictactoe" element={<TicTacToe />} />
          <Route exact path="/about" element={<Home />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
