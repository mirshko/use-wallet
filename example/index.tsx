import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useWallet } from '../src';

const App = () => {
  useWallet();

  return <div></div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
