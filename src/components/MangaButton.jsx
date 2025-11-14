import React from 'react';
import classNames from 'classnames';
import { playSound } from '../utils/sound';
import '../styles/buttons.css';

/**
 * MangaButton component - Speech-bubble styled button with sound effects
 * @param {Object} props
 * @param {string} props.text - Button text (can also use children)
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.colorType - Color variant: "buy" | "alert" | "info"
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.active - Whether button is in active state
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.size - Size variant: "small" | "large"
 * @param {React.ReactNode} props.children - Button content (alternative to text)
 */
function MangaButton({
  text,
  onClick,
  colorType,
  className,
  active = false,
  disabled = false,
  size,
  children,
  ...otherProps
}) {
  const handleClick = async (event) => {
    if (disabled) {
      return;
    }

    // Play sound effect
    try {
      await playSound('chin-chin.mp3', 0.4);
    } catch (error) {
      // Sound failed, but continue with click handler
      console.warn('[MangaButton] Sound failed:', error);
    }

    // Call the provided onClick handler
    if (onClick) {
      onClick(event);
    }
  };

  // Build class names using classnames library
  const buttonClasses = classNames(
    'manga-btn',
    {
      [colorType]: colorType, // Add colorType class (buy, alert, info)
      active: active,
      small: size === 'small',
      large: size === 'large'
    },
    className // Merge any additional classes
  );

  // Use children if provided, otherwise use text prop
  const content = children || text;

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      data-sound-on-click="true"
      {...otherProps}
    >
      {content}
    </button>
  );
}

export default MangaButton;
