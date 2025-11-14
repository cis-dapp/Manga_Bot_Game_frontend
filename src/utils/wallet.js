/**
 * Wallet utility for Manga Bot Game
 * Provides ethers.js helpers for Web3 wallet interaction
 */

import { ethers } from 'ethers';

// Store provider and signer globally
let provider = null;
let signer = null;
let currentAddress = null;

/**
 * Connect to the user's Web3 wallet (MetaMask, etc.)
 * @returns {Promise<{ok: boolean, address?: string, error?: string}>}
 */
export async function connectWallet() {
  try {
    // Check if wallet is available
    if (!window.ethereum) {
      return {
        ok: false,
        error: 'No Web3 wallet detected. Please install MetaMask or another Web3 wallet.'
      };
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      return {
        ok: false,
        error: 'No accounts found. Please unlock your wallet.'
      };
    }

    // Initialize provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    currentAddress = accounts[0];

    console.log('[Wallet] Connected:', currentAddress);

    // Listen for account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Listen for chain changes
    window.ethereum.on('chainChanged', handleChainChanged);

    return {
      ok: true,
      address: currentAddress
    };

  } catch (error) {
    console.error('[Wallet] Connection error:', error);

    // Handle specific error cases
    if (error.code === 4001) {
      return {
        ok: false,
        error: 'User rejected the connection request.'
      };
    }

    if (error.code === -32002) {
      return {
        ok: false,
        error: 'Connection request already pending. Please check your wallet.'
      };
    }

    return {
      ok: false,
      error: error.message || 'Failed to connect to wallet.'
    };
  }
}

/**
 * Get the currently connected wallet address
 * @returns {Promise<{ok: boolean, address?: string, error?: string}>}
 */
export async function getWalletAddress() {
  try {
    // Try to use cached address first
    if (currentAddress) {
      return {
        ok: true,
        address: currentAddress
      };
    }

    // Check if wallet is available
    if (!window.ethereum) {
      return {
        ok: false,
        error: 'No Web3 wallet detected.'
      };
    }

    // Try to get accounts without requesting (non-intrusive)
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });

    if (accounts && accounts.length > 0) {
      currentAddress = accounts[0];

      // Initialize provider and signer if not already done
      if (!provider) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }

      return {
        ok: true,
        address: currentAddress
      };
    }

    return {
      ok: false,
      error: 'No wallet connected. Please connect your wallet first.'
    };

  } catch (error) {
    console.error('[Wallet] Get address error:', error);

    return {
      ok: false,
      error: error.message || 'Failed to get wallet address.'
    };
  }
}

/**
 * Check if a wallet is currently connected
 * @returns {Promise<{ok: boolean, connected: boolean, address?: string, error?: string}>}
 */
export async function isConnected() {
  try {
    // Check if wallet is available
    if (!window.ethereum) {
      return {
        ok: true,
        connected: false
      };
    }

    // Check for existing accounts
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });

    const connected = accounts && accounts.length > 0;

    if (connected) {
      currentAddress = accounts[0];

      // Initialize provider and signer if not already done
      if (!provider) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }

      return {
        ok: true,
        connected: true,
        address: currentAddress
      };
    }

    return {
      ok: true,
      connected: false
    };

  } catch (error) {
    console.error('[Wallet] Connection check error:', error);

    return {
      ok: false,
      connected: false,
      error: error.message || 'Failed to check wallet connection.'
    };
  }
}

/**
 * Get the current provider instance
 * @returns {ethers.BrowserProvider|null}
 */
export function getProvider() {
  return provider;
}

/**
 * Get the current signer instance
 * @returns {ethers.Signer|null}
 */
export function getSigner() {
  return signer;
}

/**
 * Disconnect wallet and clear state
 */
export function disconnectWallet() {
  provider = null;
  signer = null;
  currentAddress = null;

  // Remove event listeners
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  }

  console.log('[Wallet] Disconnected');
}

/**
 * Handle account changes
 * @param {string[]} accounts
 */
function handleAccountsChanged(accounts) {
  console.log('[Wallet] Accounts changed:', accounts);

  if (accounts.length === 0) {
    // User disconnected their wallet
    disconnectWallet();
    window.location.reload(); // Reload to reset app state
  } else {
    // User switched accounts
    currentAddress = accounts[0];
    window.location.reload(); // Reload to update app with new account
  }
}

/**
 * Handle chain/network changes
 */
function handleChainChanged() {
  console.log('[Wallet] Chain changed');
  // Reload the page to avoid state issues
  window.location.reload();
}

/**
 * Get the current network/chain information
 * @returns {Promise<{ok: boolean, network?: object, error?: string}>}
 */
export async function getNetwork() {
  try {
    if (!provider) {
      return {
        ok: false,
        error: 'No provider available. Please connect your wallet first.'
      };
    }

    const network = await provider.getNetwork();

    return {
      ok: true,
      network: {
        chainId: Number(network.chainId),
        name: network.name
      }
    };

  } catch (error) {
    console.error('[Wallet] Network error:', error);

    return {
      ok: false,
      error: error.message || 'Failed to get network information.'
    };
  }
}

export default {
  connectWallet,
  getWalletAddress,
  isConnected,
  getProvider,
  getSigner,
  disconnectWallet,
  getNetwork
};
