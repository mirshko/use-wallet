import * as React from 'react';
import { setup, styled } from 'goober';
import { Provider as ProviderInterface, providers } from './providers';
import { useWallet } from '.';

setup(React.createElement);

const ProviderInner = styled('div')`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  & > svg {
    width: 2.75rem /* 44px */;
    height: 2.75rem /* 44px */;
    overflow: visible;
  }
`;

const ProviderButton = styled('button')`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  border: 1px solid rgba(195, 195, 195, 0.14);
  padding: 0.5rem;

  &:hover ${ProviderInner} {
    background-color: rgba(195, 195, 195, 0.14);
  }
`;

const ProviderName = styled('p')`
  margin: 0;
  margin-top: 0.75rem;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  color: rgb(12, 12, 13);
`;

const ProviderDescription = styled('p')`
  margin: 0;
  margin-top: 0.375rem;
  margin-bottom: 0.375rem;
  width: 100%;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: rgb(169, 169, 188);
`;

type ProviderProps = { provider: ProviderInterface };

const Provider = ({ provider }: ProviderProps) => {
  const ProviderLogo = provider.logo;

  return (
    <ProviderButton>
      <ProviderInner>
        <ProviderLogo />

        <ProviderName>{provider.name}</ProviderName>

        <ProviderDescription>{provider.description}</ProviderDescription>
      </ProviderInner>
    </ProviderButton>
  );
};

const DialogBackdrop = styled<{ open: boolean }>('div')`
  position: fixed;
  left: 50%;
  top: 0px;
  z-index: 2;
  margin-left: -50vw;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.4);
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  pointer-events: ${(props) => (props.open ? 'auto' : 'none')};
  visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.open ? '1' : '0')};
`;

const DialogBackdropInner = styled('div')`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const DialogBackdropClickAway = styled('div')`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const DialogProviderWrapper = styled('div')`
  position: relative;
  margin: 0.625rem /* 10px */;
  max-height: 100%;
  width: 100%;
  min-width: fit-content;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  overflow: auto;
  border-radius: 0.75rem /* 12px */;
  padding: 0px;
  max-width: 32rem /* 512px */;
  background-color: rgb(255, 255, 255);

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
`;

const Dialog = () => {
  const [open, openSet] = React.useState(false);
  const onClickAway = () => openSet(!open);

  return (
    <DialogBackdrop open={open}>
      <DialogBackdropInner>
        <DialogBackdropClickAway onClick={onClickAway} />

        <DialogProviderWrapper>
          <Provider provider={providers.metaMask} />
          <Provider provider={providers.walletConnect} />
        </DialogProviderWrapper>
      </DialogBackdropInner>
    </DialogBackdrop>
  );
};

export { Dialog };
