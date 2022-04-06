# @mirshko/use-wallet

[![CI](https://github.com/mirshko/use-wallet/actions/workflows/main.yml/badge.svg)](https://github.com/mirshko/use-wallet/actions/workflows/main.yml) [![npm](https://img.shields.io/npm/v/@mirshko/use-wallet)](https://www.npmjs.com/package/@mirshko/use-wallet) [![npm bundle size](https://badgen.net/bundlephobia/minzip/@mirshko/use-wallet)](https://bundlephobia.com/package/@mirshko/use-wallet) [![NPM](https://img.shields.io/npm/l/@mirshko/use-wallet)](https://www.npmjs.com/package/@mirshko/use-wallet)

An easy-to-integrate React hook for connecting and interacting with a Web3 wallet.

Uses [Web3Modal](https://github.com/Web3Modal/web3modal) and [Zustand](https://github.com/pmndrs/zustand).

Forked from [gimmixorg/use-wallet](https://github.com/gimmixorg/use-wallet), this version changes to an ESM only version and handles lazy importing [Web3Modal](https://github.com/Web3Modal/web3modal) and the [Ethers.js Provider](https://docs.ethers.io/v5/api/providers/provider/) via [Dynamic Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) to lower the initial bundle size of apps using this package.

### Installation

```sh
yarn add @mirshko/use-wallet
```

```sh
npm add @mirshko/use-wallet
```

### Example Connect / Disconnect button

```tsx
const ConnectWalletButton = () => {
  const { account, connect, disconnect } = useWallet();

  return (
    <>
      {!account ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <button onClick={() => disconnect()}>Disconnect Wallet</button>
      )}
    </>
  );
};
```

The `connect` function passes along an optional config to a [Web3Modal instance for additional customization](https://github.com/Web3Modal/web3modal#usage).

You can use the account information from `useWallet` anywhere inside your React app, without any extra set up.

```tsx
const UserAddress = () => {
  const { account } = useWallet();

  if (!account) return null;

  return <>{account}</>;
};
```

To run a transaction or sign a message, use the `provider` object returned by the hook for connected wallets. This is a standard [Ethers.js Provider](https://docs.ethers.io/v5/api/providers/provider/).

```tsx
const SignMessageButton = () => {
  const { account, provider } = useWallet();

  const signMessage = async () => {
    if (!provider) {
      return;
    }

    const signer = provider.getSigner();

    const signature = await signer.signMessage('Hello!');

    console.log(signature);
  };

  if (!account) {
    return null;
  }

  return <button onClick={signMessage}>Sign Message</button>;
};
```
