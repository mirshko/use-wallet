import React from 'react';
import ReactDOM from 'react-dom/client';
import { useWallet, Dialog } from '../../src';

const App = () => {
  const {} = useWallet();

  return (
    <div>
      <Dialog />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
