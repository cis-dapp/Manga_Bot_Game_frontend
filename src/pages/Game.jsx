import React, { useState, useEffect } from 'react';
import MangaButton from '../components/MangaButton';
import { getWalletAddress } from '../utils/wallet';
import { playSound } from '../utils/sound';
import { track, trackPageView } from '../utils/analytics';
import './Game.css';

/**
 * Game page component - Interactive game area with character and wallet interaction
 * Features summon actions, level-up animations, and character display
 */
function Game() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showSpeedLines, setShowSpeedLines] = useState(false);
  const [summonCount, setSummonCount] = useState(0);

  // Track page view on mount
  useEffect(() => {
    trackPageView('Game');
    checkWalletConnection();
    loadGameState();
  }, []);

  const checkWalletConnection = async () => {
    const result = await getWalletAddress();
    if (result.ok && result.address) {
      setWalletAddress(result.address);
    }
  };

  const loadGameState = () => {
    // Load from localStorage or state management
    const savedCharacter = localStorage.getItem('selectedCharacter');
    const installed = localStorage.getItem('botInstalled') === 'true';

    if (savedCharacter) {
      setSelectedCharacter(savedCharacter);
    }

    if (installed) {
      setIsInstalled(true);
    }
  };

  const handleSummon = async () => {
    // Play summon sound
    try {
      await playSound('select.mp3', 0.6);
    } catch (error) {
      console.warn('[Game] Sound failed:', error);
    }

    // Trigger speed-lines animation
    setShowSpeedLines(true);

    // Show level up message
    setTimeout(() => {
      setShowLevelUp(true);
      setSummonCount(prev => prev + 1);

      setTimeout(() => {
        setShowLevelUp(false);
      }, 2000);
    }, 500);

    setTimeout(() => {
      setShowSpeedLines(false);
    }, 1500);

    // Track summon action
    track('summon_action', {
      characterId: selectedCharacter,
      walletConnected: !!walletAddress,
      summonCount: summonCount + 1,
      page: 'Game'
    });
  };

  const handleBackToHome = () => {
    track('back_to_home', { page: 'Game' });

    // This would trigger navigation in App.jsx
    // For now, just log it
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'Home' }));
  };

  // Character images mapping
  const characterImages = {
    'red-girl': '/assets/images/redgirl.png',
    'cyber-human': '/assets/images/CyberHuman.png'
  };

  const characterNames = {
    'red-girl': 'Red-Haired Girl',
    'cyber-human': 'CyberHuman'
  };

  // Shorten address for display
  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="game-page curtain-bg">
      <div className="game-content">
        {/* Game title */}
        <div className="game-header">
          <div className="game-title-panel panel">
            <h1 className="game-title bold-outline">Battle Arena</h1>
          </div>
        </div>

        {/* Main game area */}
        <div className="game-arena">
          {/* Character display panel */}
          <div className="character-display-panel panel">
            <h2 className="panel-title">Your Character</h2>

            {selectedCharacter ? (
              <div className="character-display">
                <div className="character-image-container speed-lines">
                  <img
                    src={characterImages[selectedCharacter]}
                    alt={characterNames[selectedCharacter]}
                    className="character-game-image"
                  />
                </div>
                <h3 className="character-game-name">
                  {characterNames[selectedCharacter]}
                </h3>
                <div className="character-stats">
                  <div className="stat-item">
                    <span className="stat-label">Level:</span>
                    <span className="stat-value text-buy">{summonCount + 1}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Summons:</span>
                    <span className="stat-value text-info">{summonCount}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-character narrator-box">
                <p>No character selected. Please go back to Home and select a character.</p>
              </div>
            )}
          </div>

          {/* Wallet status panel */}
          <div className="wallet-display-panel panel">
            <h2 className="panel-title">Wallet Status</h2>

            <div className="wallet-info">
              {walletAddress ? (
                <>
                  <div className="wallet-connected">
                    <span className="status-dot connected">●</span>
                    <span className="text-buy">Connected</span>
                  </div>
                  <div className="wallet-address-display">
                    {shortenAddress(walletAddress)}
                  </div>
                </>
              ) : (
                <>
                  <div className="wallet-disconnected">
                    <span className="status-dot disconnected">●</span>
                    <span className="text-alert">Not Connected</span>
                  </div>
                  <p className="wallet-hint">Connect your wallet on the Home page</p>
                </>
              )}

              {isInstalled && (
                <div className="bot-status narrator-box">
                  <p className="text-buy">✓ Bot Installed</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-buttons cluster cluster--center cluster--lg">
          <MangaButton
            text="Summon"
            onClick={handleSummon}
            colorType="buy"
            size="large"
            className="action-btn"
            disabled={!selectedCharacter}
          />
          <MangaButton
            text="Back to Home"
            onClick={handleBackToHome}
            colorType="info"
            size="large"
            className="action-btn"
          />
        </div>

        {/* Instructions */}
        <div className="game-instructions narrator-box">
          <p>
            Click "Summon" to level up your character! Each summon increases your level
            and triggers an epic animation. Use "Back to Home" to return to character selection.
          </p>
        </div>
      </div>

      {/* Speed-lines overlay */}
      {showSpeedLines && (
        <div className="speed-lines-game-overlay speed-lines">
          <div className="speed-lines-content"></div>
        </div>
      )}

      {/* Level Up overlay */}
      {showLevelUp && (
        <div className="level-up-overlay">
          <div className="level-up-panel-game panel">
            <h2 className="level-up-text-game bold-outline">LEVEL UP!</h2>
            <p className="level-up-level">Level {summonCount + 1}</p>
            <div className="level-up-stars-game">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
