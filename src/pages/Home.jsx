import React, { useState, useEffect } from 'react';
import CharacterSelect from '../components/CharacterSelect';
import WalletConnect from '../components/WalletConnect';
import DemoButton from '../components/DemoButton';
import { track, trackPageView } from '../utils/analytics';
import './Home.css';

/**
 * Home page component - Main landing page for Manga Bot Game
 * Features character selection, wallet connection, and bot installation
 */
function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Track page view on mount
  useEffect(() => {
    trackPageView('Home');
  }, []);

  const handleCharacterSelect = (characterId) => {
    setSelectedCharacter(characterId);

    // Track character selection
    track('character_selected', {
      characterId,
      page: 'Home'
    });
  };

  const handleInstall = (characterId) => {
    // Track install action
    track('install_clicked', {
      characterId: characterId || 'none',
      hasCharacter: !!characterId,
      page: 'Home'
    });

    // Log success message
    console.log('[Home] Bot install triggered for character:', characterId || 'none');
  };

  return (
    <div className="home-page curtain-bg">
      <div className="home-content">
        {/* Main title panel */}
        <div className="title-section">
          <div className="title-panel panel">
            <h1 className="title-text bold-outline">Manga Bot Game</h1>
            <p className="subtitle-text">
              Choose your character, connect your wallet, and install your bot!
            </p>
          </div>
        </div>

        {/* Wallet connection section */}
        <section className="wallet-section">
          <h2 className="section-title">Step 1: Connect Your Wallet</h2>
          <WalletConnect />
        </section>

        {/* Character selection section */}
        <section className="character-section">
          <h2 className="section-title">Step 2: Choose Your Character</h2>
          <CharacterSelect
            onSelect={handleCharacterSelect}
            selectedId={selectedCharacter}
          />
        </section>

        {/* Demo/Install section */}
        <section className="demo-section">
          <h2 className="section-title">Step 3: Install Your Bot</h2>
          <DemoButton
            selectedId={selectedCharacter}
            onInstall={handleInstall}
          />
        </section>

        {/* Info box */}
        <div className="info-box narrator-box">
          <p className="info-text">
            Welcome to the Manga Bot Game experimental project! Follow the steps above
            to experience the full interactive demo.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
