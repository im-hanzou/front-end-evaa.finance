import { create } from 'zustand';
import { TonConnect, Wallet, isWalletInfoInjected, WalletInfoRemote } from '@tonconnect/sdk';
import { BN } from 'bn.js'
import { fromNano, beginCell, toNano, Address } from 'ton';

import { MASTER_EVAA_ADDRESS, USDT_EVAA_ADDRESS } from '@/config';
import { isMobile, openLink, addReturnStrategy } from '@/utils';
import { bufferToBigInt, friendlifyUserAddress } from '@/ton/utils';
import { tonClient } from '@/ton/client';
import { Minter } from '@/ton/minter';

import { Token, useTokens } from './tokens';

const dappMetadata = { manifestUrl: 'https://raw.githubusercontent.com/evaafi/front-end/dev/getConfig.json' };

interface AuthStore {
  isLoading: boolean;
  universalLink: string;
  userAddress: string;

  connector: TonConnect,
  wallet: Wallet | null,

  logout: () => void;
  callIfLoged: <T>(callback: (...args: T[]) => void) => ((...args: T[]) => void);
  login: () => void;
  sendTransaction: (address: string, amount: string, tokenId: string, action: string) => void;

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

    sendTransaction: async (address: string, amount: string, tokenId: string, action: string) => {
      const usdtAddress = useTokens.getState().tokens[Token.USDT]?.address;
      const tonAddress = useTokens.getState().tokens[Token.TON]?.address;
      
      const body = beginCell()
        .endCell()

      let messages = []

      if (tokenId === 'ton') {
        if (action === 'supply' || action === 'repay') {
          const body = beginCell()
            .endCell();
          messages.push({
            address,
            amount: toNano(amount).toString(),
            payload: body.toBoc().toString('base64'),
          })
        } else if (action === 'withdraw' || action === 'borrow') {
          const assetAddress = bufferToBigInt(tonAddress?.hash) // todo change address

          const body = beginCell()
            .storeUint(60, 32)
            .storeUint(0, 64)
            .storeUint(assetAddress, 256)
            .storeUint(toNano(amount), 64)
            .endCell()

          messages.push({
            address: MASTER_EVAA_ADDRESS,
            amount: toNano('0.1').toString(),
            payload: body.toBoc().toString('base64'),
          })
        }
      } else if (tokenId === 'usdt') {
        if (action === 'supply' || action === 'repay') {
          const contract = new Minter(USDT_EVAA_ADDRESS);
          const juserwalletEvaaMasterSC = await tonClient.open(contract).getWalletAddress(Address.parseFriendly(address).address)
          const body = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            // @ts-ignore
            .storeCoins(new BN(Number(amount) * (1000000) + ''))
            .storeAddress(MASTER_EVAA_ADDRESS)
            .storeAddress(null) //responce add?
            .storeDict(null)
            .storeCoins(toNano('0.1'))
            .storeMaybeRef(null) //tons to be forwarded
            .endCell()
          const juserwallet = await tonClient.open(contract).getWalletAddress(Address.parse(connector?.wallet?.account.address as string))
          console.log(juserwallet.toString({
            urlSafe: true,
            bounceable: false,
            testOnly: true
          }))
          messages.push({
            address: juserwallet.toString({
              urlSafe: true,
              bounceable: false,
              testOnly: true
            }),
            amount: toNano('0.2').toString(),
            payload: body.toBoc().toString('base64'),
          })
        } else if (action === 'withdraw' || action === 'borrow') {
          const assetAddress = bufferToBigInt(usdtAddress?.hash) // todo change address
          const body = beginCell()
            .storeUint(60, 32)
            .storeUint(0, 64)
            .storeUint(assetAddress, 256)
            .storeUint(BigInt(Number(amount) * (1000000) + ''), 64)
            .endCell()

          messages.push({
            address,
            amount: toNano('0.1').toString(),
            payload: body.toBoc().toString('base64'),
          })
        }
      }
      const tx = await connector.sendTransaction({
        validUntil: (new Date()).getTime() / 1000 + 5 * 1000 * 60,
        messages
      });

      if (tx.boc) {
        alert('Transaction is done');
        location.reload();
      } else {
        alert('Something went wrong')
      }
    },

    resetUniversalLink: () => {
      set({ universalLink: undefined });
    }
  }
})
