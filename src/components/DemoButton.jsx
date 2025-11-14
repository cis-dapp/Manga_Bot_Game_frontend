import React, { useState } from 'react';
import MangaButton from './MangaButton';
import { playSound } from '../utils/sound';
import { track } from '../utils/analytics';
import './DemoButton.css';

/**
 * DemoButton component - Simulates "install bot" action with manga effects
 * @param {Object} props
 * @param {string} props.selectedId - Currently selected character ID
 * @param {Function} props.onInstall - Callback when install is triggered
 */
function DemoButton({ selectedId, onInstall }) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showSpeedLines, setShowSpeedLines] = useState(false);

  const handleInstall = async () => {
    if (isInstalling) return;

    setIsInstalling(true);

    try {
      // Play demo sound
      await playSound('demo.mp3', 0.5);
    } catch (error) {
      console.warn('[DemoButton] Sound failed:', error);
    }

    // Trigger speed-lines animation
    setShowSpeedLines(true);

    // Track install action
    track('install_bot', {
      characterId: selectedId || 'none',
      hasCharacter: !!selectedId
    });

    // If character is selected, show LEVEL UP! message
    if (selectedId) {
      setTimeout(() => {
        setShowLevelUp(true);

        // Hide level up message after 2.5 seconds
        setTimeout(() => {
          setShowLevelUp(false);
        }, 2500);
      }, 500);
    }

    // Remove speed-lines after animation completes
    setTimeout(() => {
      setShowSpeedLines(false);
      setIsInstalling(false);
    }, 2000);

    // Call onInstall callback
    if (onInstall) {
      onInstall(selectedId);
    }
  };

  return (
    <div className="demo-button-wrapper">
      {/* Install button */}
      <MangaButton
        text={isInstalling ? 'Installing...' : 'Install Bot'}
        onClick={handleInstall}
        colorType="info"
        className="demo-button"
        size="large"
        disabled={isInstalling}
      />

      {/* Speed-lines overlay */}
      {showSpeedLines && (
        <div className="speed-lines-overlay speed-lines">
          <div className="speed-lines-content"></div>
        </div>
      )}

      {/* Level Up panel */}
      {showLevelUp && (
        <div className="level-up-panel panel">
          <div className="level-up-content">
            <h2 className="level-up-text bold-outline">LEVEL UP!</h2>
            <p className="level-up-subtitle">Bot installed successfully!</p>
            <div className="level-up-stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
          </div>
        </div>
      )}

      {/* Character requirement hint */}
      {!selectedId && (
        <div className="hint-box">
          <p className="hint-text text-info">
            💡 Select a character first for the full experience!
          </p>
        </div>
      )}
    </div>
  );
}

export default DemoButton;
