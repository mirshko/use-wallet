import type { Network, Web3Provider } from '@ethersproject/providers';
import { useCallback, useEffect, useState } from 'react';
import type { default as Web3Modal, ICoreOptions } from 'web3modal';
import create from 'zustand';

type State = {
  provider: Web3Provider | undefined;
  account: Account | undefined;
  network: Network | undefined;
  web3Modal: Web3Modal | undefined;
};

const useStore = create<State>()((_set) => ({
  provider: undefined,
  account: undefined,
  network: undefined,
  web3Modal: undefined,
}));

type Account = string;
type ConnectWallet = (opts?: Partial<ICoreOptions>) => Promise<State>;
type DisconnectWallet = () => void;
type UseWallet = State & {
  connect: ConnectWallet;
  disconnect: DisconnectWallet;
};

export function useWallet(): UseWallet {
  // Retreive the current values from the store, and automatically re-render on updates
  const account = useStore((state) => state.account);
  const network = useStore((state) => state.network);
  const provider = useStore((state) => state.provider);
  const web3Modal = useStore((state) => state.web3Modal);

  const connect: ConnectWallet = useCallback(async (opts) => {
    // Dynamically import Web3Modal
    const Web3Modal = await import('web3modal').then((m) => m.default);

    // Launch modal with the given options
    const web3Modal = new Web3Modal(opts);
    const web3ModalProvider = await web3Modal.connect();

    // Dynamically import Web3Provider
    const Web3Provider = await import('@ethersproject/providers').then(
      (m) => m.Web3Provider
    );

    // Set up Ethers provider and initial state with the response from the web3Modal
    const initialProvider = new Web3Provider(web3ModalProvider, 'any');
    const getNetwork = () => initialProvider.getNetwork();
    const initialAccounts = await initialProvider.listAccounts();
    const initialNetwork = await getNetwork();

    const nextState = {
      web3Modal,
      provider: initialProvider,
      network: initialNetwork,
      account: initialAccounts[0],
    };

    // Set up event listeners to handle state changes
    web3ModalProvider.on('accountsChanged', (accounts: string[]) => {
      if (__DEV__) {
        console.log("Event 'accountsChanged' with payload,", accounts);
      }

      useStore.setState({ account: accounts[0] });
    });

    web3ModalProvider.on('chainChanged', async (_chainId: string) => {
      if (__DEV__) {
        console.log("Event 'chainChanged' with payload,", _chainId);
      }

      const network = await getNetwork();

      useStore.setState({ network });
    });

    web3ModalProvider.on(
      'disconnect',
      (reason: { code: number; message: string }) => {
        if (__DEV__) {
          console.log("Event 'disconnect' with payload", reason);
        }

        web3Modal.clearCachedProvider();
        useStore.setState({
          provider: undefined,
          network: undefined,
          account: undefined,
        });
      }
    );

    web3ModalProvider.on('connect', (info: { chainId: number }) => {
      if (__DEV__) {
        console.log("Event 'connect' with payload", info);
      }
    });

    useStore.setState(nextState);

    return nextState;
  }, []);

  const disconnect: DisconnectWallet = useCallback(async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }

    useStore.setState({
      provider: undefined,
      network: undefined,
      account: undefined,
    });
  }, [web3Modal]);

  return {
    connect,
    provider,
    account,
    network,
    disconnect,
    web3Modal,
  };
}
