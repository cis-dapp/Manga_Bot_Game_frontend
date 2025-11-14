import React, { useState, useEffect } from 'react';
import MangaButton from './MangaButton';
import { connectWallet, disconnectWallet, isConnected } from '../utils/wallet';
import { playSound } from '../utils/sound';
import { track } from '../utils/analytics';
import './WalletConnect.css';

/**
 * WalletConnect component - Manga-styled wallet connection interface
 * Handles Web3 wallet connection with visual feedback
 */
function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check wallet connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const result = await isConnected();
    if (result.ok && result.connected) {
      setConnected(true);
      setAddress(result.address);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await connectWallet();

      if (result.ok) {
        // Play success sound
        try {
          await playSound('chin-chin.mp3', 0.5);
        } catch (soundError) {
          console.warn('[WalletConnect] Sound failed:', soundError);
        }

        setConnected(true);
        setAddress(result.address);

        // Track successful connection
        track('wallet_connected', { address: result.address });
      } else {
        // Handle connection error
        setError(result.error || 'Failed to connect wallet');
        track('wallet_connection_failed', { error: result.error });
      }
    } catch (err) {
      setError('Unexpected error connecting wallet');
      console.error('[WalletConnect] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setConnected(false);
    setAddress(null);
    setError(null);

    // Track disconnection
    track('wallet_disconnected');
  };

  // Shorten address for display (0x1234...5678)
  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {/* Status narrator box */}
      <div className="narrator-box wallet-status">
        <p className="status-text">
          {connected ? (
            <>
              <span className="status-indicator connected">●</span>
              <span className="text-buy">Connected</span>
              {address && (
                <>
                  {' — '}
                  <span className="wallet-address" title={address}>
                    {shortenAddress(address)}
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <span className="status-indicator disconnected">●</span>
              <span className="text-neutral">Not Connected</span>
            </>
          )}
        </p>
      </div>

      {/* Connect/Disconnect button */}
      <div className="wallet-button-wrapper">
        {!connected ? (
          <MangaButton
            text={loading ? 'Connecting...' : 'Connect Wallet'}
            onClick={handleConnect}
            colorType="buy"
            className="wallet-button power-up-bubble"
            disabled={loading}
          />
        ) : (
          <MangaButton
            text="Disconnect"
            onClick={handleDisconnect}
            colorType="alert"
            className="wallet-button"
          />
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="wallet-error narrator-box">
          <p className="text-alert">{error}</p>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;
