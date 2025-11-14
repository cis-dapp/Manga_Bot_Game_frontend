import React from 'react';
import classNames from 'classnames';
import { playSound } from '../utils/sound';
import './CharacterSelect.css';

/**
 * CharacterSelect component - Manga-styled character selection cards
 * @param {Object} props
 * @param {Function} props.onSelect - Callback when character is selected (characterId)
 * @param {string} props.selectedId - Currently selected character ID
 */
function CharacterSelect({ onSelect, selectedId }) {
  const characters = [
    {
      id: 'red-girl',
      name: 'Red-Haired Girl',
      description: 'Pale-skinned girl with fiery red hair',
      image: '/assets/images/redgirl.png'
    },
    {
      id: 'cyber-human',
      name: 'CyberHuman',
      description: 'CyberHuman-inspired avatar',
      image: '/assets/images/CyberHuman.png'
    }
  ];

  const handleSelect = async (characterId) => {
    // Play selection sound
    try {
      await playSound('select.mp3', 0.5);
    } catch (error) {
      console.warn('[CharacterSelect] Sound failed:', error);
    }

    // Call onSelect callback
    if (onSelect) {
      onSelect(characterId);
    }
  };

  return (
    <div className="character-select">
      <h2 className="character-select-title">Choose Your Character</h2>

      <div className="character-grid">
        {characters.map((character) => {
          const isSelected = selectedId === character.id;

          const cardClasses = classNames(
            'character-card',
            'panel',
            {
              'selected': isSelected,
              'speed-lines': true // Always enable speed-lines for hover effect
            }
          );

          return (
            <div
              key={character.id}
              className={cardClasses}
              onClick={() => handleSelect(character.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Select ${character.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(character.id);
                }
              }}
            >
              <div className="character-image-wrapper">
                <img
                  src={character.image}
                  alt={character.name}
                  className="character-image"
                />
              </div>

              <div className="character-info">
                <h3 className="character-name">{character.name}</h3>
                <p className="character-description">{character.description}</p>
              </div>

              {isSelected && (
                <div className="selected-badge">
                  <span className="badge-text">SELECTED</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CharacterSelect;
