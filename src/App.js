import './App.css';
import React, { useState } from 'react';
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

import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import Tooltip from '@mui/material/Tooltip';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { alpha, createTheme, getContrastRatio, ThemeProvider } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp.js';

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
      dark: '#000000',
      contrastText: '#eee',
    },
    pumpkin: {
      main: alpha('#be630d', 0.9),
      light: alpha('#be630d', 0.7),
      dark: '#be630d',
      contrastText: '#eeeeee',
    },
    blue: {
      main: alpha('#fff', 0.9),
      light: alpha('#fff', 0.7),
      dark: '#fff',
      contrastText: '#111',
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
  // Boolean for determining whether navbar should be using mobile or desktop versions of components and assets.
  const [windowSmall, setWindowSmall] = useState(window.innerWidth <= 500);
  const [windowWide, setWindowWide] = useState(window.innerWidth > 1920);

  /**
   * Event fired when window is resized. Updates boolean small.
   */
  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setWindowSmall(true);
      setWindowWide(false)
    }
    else if (window.innerWidth > 1920) {
      setWindowSmall(false);
      setWindowWide(true)
    }
    else {
      setWindowSmall(false);
      setWindowWide(false);
    }
  }
  window.onresize = handleResize;

  // Mui function that returns true after the user scrolls enough to reach threshold (default=100)
  const scrollTrigger = useScrollTrigger({ threshold: 600 });

  /**
   * Scrolls window to the top of the page, smoothly.
   */
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  return (
    <div id='App'>
      <ThemeProvider theme={theme}>
        <Navbar scrollTrigger={scrollTrigger} />
        <Slide in={scrollTrigger} direction='up'>
          <Tooltip>
            <Fab
              id='scroll-to-top-btn'
              color='success'
              aria-label='scroll-to-top'
              onClick={handleScrollToTop}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Tooltip>
        </Slide>
        <Router>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/apps' element={<Home />} />
            <Route exact path='/apps/clock' element={<Clock />} />
            <Route exact path='/apps/calculator' element={<Calculator />} />

            <Route path='/apps/nikkeTeamBuilder/' element={<NikkeTB
              theme={theme}
              windowSmall={windowSmall}
              windowWide={windowWide}
            />} >

              {/* Route below takes dynamic URL data */}
              <Route path=':urlId' element={<NikkeTB
                theme={theme}
                windowSmall={windowSmall}
                windowWide={windowWide}
              />} />

            </Route>

            <Route exact path='/apps/todo-list' element={<ToDo />}></Route>
            <Route exact path='/games' element={<Home />} />
            <Route exact path='/games/tictactoe' element={<TicTacToe />} />
            <Route exact path='/about' element={<About />} />
          </Routes>
        </Router>
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default App;
