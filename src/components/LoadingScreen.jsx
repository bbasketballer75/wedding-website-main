import React from 'react';
import PropTypes from 'prop-types';
import './LoadingScreen.css';

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <output className="loading-overlay" aria-live="polite">
      <div className="loading-content fade-in">
        <div className="loading-spinner" />
        <div className="loading-message script-font">{message}</div>
      </div>
    </output>
  );
}

LoadingScreen.propTypes = {
  message: PropTypes.string,
};

export default LoadingScreen;
