import React from 'react';
import './DisclaimerBox.css';

/**
 * DisclaimerBox component - Fixed footer disclaimer with narrator-box styling
 * Displays entertainment disclaimer with accessibility support
 */
function DisclaimerBox() {
  return (
    <footer
      className="disclaimer-box narrator-box"
      role="contentinfo"
      aria-label="Disclaimer"
    >
      <p className="disclaimer-text">
        This is for entertainment only. Human behavior experimental project.
      </p>
    </footer>
  );
}

export default DisclaimerBox;
