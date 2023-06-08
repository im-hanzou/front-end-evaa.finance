import { create } from 'zustand';
import { TonConnectUI, Wallet} from '@tonconnect/ui'
import { fromNano, beginCell, toNano, Address } from 'ton';

import { MASTER_EVAA_ADDRESS } from '@/config';
import { friendlifyUserAddress } from '@/ton/utils';

import { Token, TokenMap, useTokens } from './tokens';

const dappMetadata = { manifestUrl: 'https://raw.githubusercontent.com/evaafi/tonconnect-config/main/config.json' };

export enum Action {
  supply,
  repay,
  withdraw,
  borrow
}

interface AuthStore {
  isLogged: boolean;
  isLoading: boolean;
  isWaitingResponse: boolean;
  universalLink: string;
  userAddress: string;

  connector: TonConnectUI,
  wallet: Wallet | null,

  logout: () => void;
  callIfLoged: <T>(callback: (...args: T[]) => void) => ((...args: T[]) => void);
  login: () => void;
  sendTransaction: (amount: string, token: Token, action: Action) => void;

  resetUniversalLink: () => void;
}

export const useWallet = create<AuthStore>((set, get) => {
  const connector = new TonConnectUI(dappMetadata);

  // @ts-ignore
  const isLogged = !!connector.walletInfoStorage.localStorage[connector.walletInfoStorage.storageKey];

  connector.onStatusChange((async (wallet) => {
    const userFriendlyAddress = friendlifyUserAddress(wallet?.account.address);
    const userAddress = Address.parse(wallet?.account.address as string);

    set(() => ({ wallet, userAddress: userFriendlyAddress, universalLink: '' }));

    useTokens.getState().initTokens(userAddress);
  }), console.error);

  return {
    isLogged,
    isLoading: false,
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
      connector.connectWallet()
    },

    sendTransaction: async (amount: string, token: Token, action: Action) => {
      const hashKey = useTokens.getState().tokens[token]?.hashKey as bigint;
      const jettonAddress = useTokens.getState().tokens[token]?.address as Address;
      const nanoAmount = BigInt(Number(amount) * TokenMap[token].decimal);
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
          amount: toNano('0.333').toString(),
          payload: body.toBoc().toString('base64'),
        });
      }

      if (action === Action.supply || action === Action.repay) {

        if (String(token) === String(Token.TON)) {
          const body = beginCell().endCell();

          messages.push({
            address,
            amount: (nanoAmount + toNano('0.1333')).toString(),
            payload: body.toBoc().toString('base64'),
          })
        } else {
          // API for rest jettons should be same
          // @ts-ignore
          const userJettonWalletAddress = await TokenMap[token].getAddress(Address.parse(connector?.wallet?.account.address)) as Address;

          const body = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(nanoAmount)
            .storeAddress(MASTER_EVAA_ADDRESS)
            .storeAddress(null) //responce add?
            .storeDict(null)
            .storeCoins(toNano('0.1333'))
            .storeMaybeRef(null) //tons to be forwarded
            .endCell()

          messages.push({
            address: userJettonWalletAddress.toString(),
            amount: toNano('0.222').toString(),
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

      } catch (e) {
        set({ isWaitingResponse: false });

        throw (e);
      }
    },

    resetUniversalLink: () => {
      set({ universalLink: undefined });
    }
  }
})
