import React from 'react'

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connectedWallet, disconnectWallet } from '../../redux/walletConnect/actions'

// WalletConnect
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';


interface IProps {
  isConnected: boolean;
  action: {
    connectedWallet: (session: any) => void;
    disconnectWallet: () => void;
  };
}

const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org'
});

const WalletConnectComponent = ({ action, isConnected }: IProps) => {
  React.useEffect(() => {
    if (!connector.connected) {
      connector.createSession();
    }

    connector.on('connect', (error, payload) => {
      if (error) throw error;

      // Close QR Code Modal
      QRCodeModal.close();

      action.connectedWallet(payload.params[0]);
    });

    connector.on('session_update', (error, payload) => {
      if (error) throw error;

      action.connectedWallet(payload.params[0]);
    });

    connector.on('disconnect', (error, payload) => {
      if (error) throw error;

      action.disconnectWallet();
    });
  }, [connector.connected]);

  const handleConnect = () => {
    QRCodeModal.open(connector.uri, () => {
      console.log('QR Code Modal closed');
    });
  };

  const handleDisconnect = async () => {
    await connector.killSession();
    await connector.createSession();

    action.disconnectWallet();
  };

  return (
    <React.Fragment>
      {isConnected ? (
        <button
          type="button"
          className="inline-block flex-1 py-2 px-4 rounded text-sm font-semibold bg-gray-600 text-white drop-shadow-xl hover:drop-shadow-none transition-all duration-300"
          onClick={handleDisconnect}
        >
          <span>Disconnect Wallet</span>
        </button>
      ) : (
        <button
          type="button"
          className="inline-block flex-1 py-2 px-4 rounded text-sm font-semibold bg-gray-600 text-white drop-shadow-xl hover:drop-shadow-none transition-all duration-300"
          onClick={handleConnect}
        >
          <span>Connect Wallet</span>
        </button>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  isConnected: state.walletConnect.connected,
  accounts: state.walletConnect.session.accounts,
});

const mapDispatchToProps = (dispatch: any) => ({
  action: bindActionCreators(
    {
      connectedWallet,
      disconnectWallet
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnectComponent);