export const WALLET_CONNECT_CONNECT = 'WALLET_CONNECT:CONNECT';
export const WALLET_CONNECT_DISCONNECT = 'WALLET_CONNECT:DISCONNECT';
export const WALLET_CONNECT_CONNECTED = 'WALLET_CONNECT:CONNECTED';
export const WALLET_CONNECT_DISCONNECTED = 'WALLET_CONNECT:DISCONNECTED';
export const WALLET_CONNECT_UPDATE_SESSION = 'WALLET_CONNECT:UPDATE_SESSION';


export const connectWallet = () => ({
  type: WALLET_CONNECT_CONNECT,
});

export const connectedWallet = (session: any) => ({
  type: WALLET_CONNECT_CONNECTED,
  payload: session,
});

export const disconnectWallet = () => ({
  type: WALLET_CONNECT_DISCONNECT,
});

export const disconnectedWallet = () => ({
  type: WALLET_CONNECT_DISCONNECTED
});