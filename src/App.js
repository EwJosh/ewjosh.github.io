import './App.css';
import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Navbar from './components/navbar.js';
import Footer from './components/footer.js';

import Home from './pages/home.js';
import Clock from './pages/clock.js';
import Calculator from './pages/calculator.js';
import NikkeTB from './pages/nikkeTeamBuilder.js';
import ToDo from './pages/toDo.js';

import TicTacToe from './games/tictactoe.js';

import About from './pages/about.js'

import { alpha, createTheme, getContrastRatio, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    white: {
      main: alpha('#fff', 0.9),
      light: alpha('#fff', 0.7),
      dark: '#fff',
      contrastText: '#111',
    },
    black: {
      main: alpha('#000', 0.9),
      light: alpha('#000', 0.7),
      dark: '#000',
      contrastText: '#eee',
    },
    selected: {
      main: alpha('#111', 0.9),
      light: alpha('#111', 0.7),
      dark: '#111',
      contrastText: getContrastRatio(alpha('#111', 0.9), '#fff') > 4.5 ? '#fff' : '#111',
    },
    unselected: {
      main: alpha('#eee', 0.9),
      light: alpha('#eee', 0.7),
      dark: '#eee',
      contrastText: getContrastRatio(alpha('#eee', 0.9), '#fff') > 4.5 ? '#fff' : '#111',
    }
  }
});

function App() {
  return (
    <div id="App">
      <ThemeProvider theme={theme}>
        <Navbar />
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/apps" element={<Home />} />
            <Route exact path="/apps/clock" element={<Clock />} />
            <Route exact path="/apps/calculator" element={<Calculator />} />
            <Route exact path="/apps/nikkeTeamBuilder" element={<NikkeTB theme={theme} />} />
            <Route exact path="/apps/todo-list" element={<ToDo />}></Route>
            <Route exact path="/games" element={<Home />} />
            <Route exact path="/games/tictactoe" element={<TicTacToe />} />
            <Route exact path="/about" element={<About />} />
          </Routes>
        </Router>
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default App;
