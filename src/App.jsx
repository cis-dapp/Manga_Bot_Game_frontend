import React, { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import MangaButton from './components/MangaButton';
import DisclaimerBox from './components/DisclaimerBox';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home />;
      case 'Game':
        return <Game />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App curtain-texture">
      <nav className="top-navigation">
        <MangaButton
          onClick={() => setCurrentPage('Home')}
          active={currentPage === 'Home'}
        >
          Home
        </MangaButton>
        <MangaButton
          onClick={() => setCurrentPage('Game')}
          active={currentPage === 'Game'}
        >
          Game
        </MangaButton>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>

      <DisclaimerBox />
    </div>
  );
}

export default App;
