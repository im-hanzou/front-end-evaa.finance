import { create } from 'zustand';
import { TonConnect, Wallet, isWalletInfoInjected, WalletInfoRemote } from '@tonconnect/sdk';
import { BN } from 'bn.js'
import { fromNano, beginCell, toNano, Address } from 'ton';

import { MASTER_EVAA_ADDRESS, USDT_EVAA_ADDRESS } from '@/config';
import { isMobile, openLink, addReturnStrategy } from '@/utils';
import { bufferToBigInt, friendlifyUserAddress } from '@/ton/utils';
import { tonClient } from '@/ton/client';
import { Minter } from '@/ton/minter';

import { Token, TokenMap, useTokens } from './tokens';

const dappMetadata = { manifestUrl: 'https://raw.githubusercontent.com/evaafi/front-end/dev/getConfig.json' };

export enum Action {
  supply,
  repay,
  withdraw,
  borrow
}

interface AuthStore {
  isLoading: boolean;
  isWaitingResponse: boolean;
  universalLink: string;
  userAddress: string;

  connector: TonConnect,
  wallet: Wallet | null,

  logout: () => void;
  callIfLoged: <T>(callback: (...args: T[]) => void) => ((...args: T[]) => void);
  login: () => void;
  sendTransaction: (amount: string, token: Token, action: Action) => void;

  resetUniversalLink: () => void;
}

export const useWallet = create<AuthStore>((set, get) => {
  const connector = new TonConnect(dappMetadata);

  connector.onStatusChange((async (wallet) => {
    const userFriendlyAddress = friendlifyUserAddress(wallet?.account.address);
    const userAddress = Address.parse(wallet?.account.address as string);
  
    set(() => ({ wallet, userAddress: userFriendlyAddress, universalLink: '' }));

    useTokens.getState().initTokens(userAddress);
  }), console.error);

  connector.restoreConnection().then(() => {
    set({ isLoading: false });
  })

  return {
    isLoading: true,
    isWaitingResponse: false,
    universalLink: '',
    userAddress: friendlifyUserAddress(connector?.wallet?.account.address),
    connector,
    wallet: connector.wallet,

    logout: () => {
      connector.disconnect();
    },

    callIfLoged: <T>(callback: (...args: T[]) => void) => (
      (...args: T[]) => {
        if (get().userAddress) {
          callback(...args);
        } else {
          get().login();
        }
      }
    ),

    login: async () => {
      const walletsList = await connector.getWallets();
      const embeddedWallet = walletsList.filter(isWalletInfoInjected).find((wallet) => wallet.embedded);
      const tonkeeperConnectionWallet = walletsList.find((wallet) => wallet.name === "Tonkeeper") as WalletInfoRemote;

      if (embeddedWallet) {
        connector.connect({ jsBridgeKey: embeddedWallet.jsBridgeKey });
        return;
      }

      const tonkeeperConnectionSource = {
        universalLink: tonkeeperConnectionWallet.universalLink,
        bridgeUrl: tonkeeperConnectionWallet.bridgeUrl,
      };

      const universalLink = connector.connect(tonkeeperConnectionSource) || '';

      if (isMobile()) {
        openLink(addReturnStrategy(universalLink, 'none'), '_blank');
      } else {
        set({ universalLink });
      }

    },

    sendTransaction: async (amount: string, token: Token, action: Action) => {
      const hashKey = useTokens.getState().tokens[token]?.hashKey as bigint;
      const jettonAddress = useTokens.getState().tokens[token]?.address as Address;
      const nanoAmount =  BigInt(Number(amount) * TokenMap[token].decimal);

      const address = MASTER_EVAA_ADDRESS.toString();

      let messages = [];

      if (action === Action.withdraw || action === Action.borrow) {
        const body = beginCell()
          .storeUint(60, 32)
          .storeUint(0, 64)
          .storeUint(hashKey, 256)
          .storeUint(nanoAmount, 64)
          .endCell()

        messages.push({
          address,
          amount: toNano('0.1').toString(),
          payload: body.toBoc().toString('base64'),
        });
      }

      if (action === Action.supply || action === Action.repay) {
        
        if (String(token) === String(Token.TON)) {
          const body = beginCell().endCell();

          messages.push({
            address,
            amount: nanoAmount.toString(),
            payload: body.toBoc().toString('base64'),
          })
        } else {
          // API for rest jettons should be same
          const body = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(nanoAmount)
            .storeAddress(MASTER_EVAA_ADDRESS)
            .storeAddress(null) //responce add?
            .storeDict(null)
            .storeCoins(toNano('0.1'))
            .storeMaybeRef(null) //tons to be forwarded
            .endCell()

          messages.push({
            address: jettonAddress.toString({
              urlSafe: true,
              bounceable: false,
              testOnly: true
            }),
            amount: toNano('0.2').toString(),
            payload: body.toBoc().toString('base64'),
          })
        }
      }

      set({ isWaitingResponse: true });

      try {
        await connector.sendTransaction({
          validUntil: (new Date()).getTime() / 1000 + 5 * 1000 * 60,
          messages
        });
        
        set({ isWaitingResponse: false });

      } catch(e) {
        set({ isWaitingResponse: false });

        throw(e);
      }
    },

    resetUniversalLink: () => {
      set({ universalLink: undefined });
    }
  }
})
