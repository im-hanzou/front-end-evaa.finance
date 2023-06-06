import axios from 'axios';
import { create } from 'zustand';
import { Address, fromNano } from "ton";

import { bufferToBigInt } from '@/ton/utils';
import { tonClient } from "@/ton/client";
import { Minter } from "@/ton/minter";
import { formatUsd } from '@/utils';
import { MASTER_EVAA_ADDRESS, USDT_EVAA_ADDRESS, USDC_EVAA_ADDRESS, BTC_EVAA_ADDRESS, ETH_EVAA_ADDRESS, TON_JETTON_ADDRESS } from "@/config";

import TONLogo from '../assets/pictures/ton_asset.png';
import USDTLogo from '../assets/pictures/usdt_asset.png';
import TOSLogo from '../assets/pictures/tos_asset.png';
import USDCLogo from '../assets/pictures/usdc_asset.png';
import ETHLogo from '../assets/pictures/eth_asset.png';
import BTCLogo from '../assets/pictures/btc_asset.png';

import { useBalance } from './balance';

export enum Token {
    TON,
    USDT,
    USDC,
    BTC,
    ETH,
    TOS,
}

interface TokenMapValue {
    ticker: string;
    tokenId: string;
    decimal: number,
    icon: any,
    getAddress: (ownerAddress?: Address) => Promise<Address>;
    getBalance: (userAddress: Address) => Promise<string>
}

type TokenMapType = {
    [key in Token]: TokenMapValue
}

const getAddressByTokenId = async (tokenAddress: Address, ownerAddress?: Address) => {
    const contract = new Minter(tokenAddress);
    return await tonClient.open(contract).getWalletAddress(ownerAddress ?? MASTER_EVAA_ADDRESS) as Address;
}

const getBalanceByTokenId = async (tokenAddress: Address, userAddress: Address, decimal: number) => {
    const contract = new Minter(tokenAddress);
    const juserwalletEvaaMasterSC = await tonClient.open(contract).getWalletAddress(userAddress)
    const contract1 = new Minter(Address.parseFriendly(juserwalletEvaaMasterSC.toString()).address);
    let usdtBalance = '0';
    try {
        const juserwalletEvaaMasterSC1 = await tonClient.open(contract1).getBalance()
        usdtBalance = String(juserwalletEvaaMasterSC1.readNumber() / decimal);
    } catch (e) {
        console.log('error with get getBalanceByTokenId', e)
    }
    return usdtBalance;
}

export const TokenMap: TokenMapType = {
    [Token.TON]: {
        ticker: 'TON',
        tokenId: 'ton',
        decimal: Math.pow(10, 9),
        icon: TONLogo,
        async getAddress(_?: any) {
            return TON_JETTON_ADDRESS;
        },
        async getBalance(userAddress: Address) {

            return fromNano(await tonClient.getBalance(userAddress));
        }
    },
    [Token.USDT]: {
        ticker: 'USDT',
        tokenId: 'usdt',
        decimal: Math.pow(10, 6),
        icon: USDTLogo,
        async getAddress(ownerAddress?: Address) {
            return await getAddressByTokenId(USDT_EVAA_ADDRESS, ownerAddress)
        },
        async getBalance(userAddress: Address) {

            return await getBalanceByTokenId(USDT_EVAA_ADDRESS, userAddress, this.decimal)
        }
    },
    [Token.USDC]: {
        ticker: 'USDC',
        tokenId: 'usdc',
        decimal: Math.pow(10, 6),
        icon: USDCLogo,
        async getAddress(ownerAddress?: Address) {
            return await getAddressByTokenId(USDC_EVAA_ADDRESS, ownerAddress)
        },
        async getBalance(userAddress: Address) {
            return await getBalanceByTokenId(USDC_EVAA_ADDRESS, userAddress, this.decimal)
        }
    },
    [Token.BTC]: {
        ticker: 'BTC',
        tokenId: 'btc',
        decimal: Math.pow(10, 8), // todo take it from sc 
        icon: BTCLogo,
        async getAddress(ownerAddress?: Address) {
            return await getAddressByTokenId(BTC_EVAA_ADDRESS, ownerAddress)
        },
        async getBalance(userAddress: Address) {
            return await getBalanceByTokenId(BTC_EVAA_ADDRESS, userAddress, this.decimal)
        }
    },
    [Token.ETH]: {
        ticker: 'ETH',
        tokenId: 'eth',
        decimal: Math.pow(10, 8), // todo take it from sc 
        icon: ETHLogo,
        async getAddress(ownerAddress?: Address) {
            return await getAddressByTokenId(ETH_EVAA_ADDRESS, ownerAddress)
        },
        async getBalance(userAddress: Address) {
            return await getBalanceByTokenId(ETH_EVAA_ADDRESS, userAddress, this.decimal)
        }
    },
    [Token.TOS]: {
        ticker: 'TOS',
        tokenId: 'tos',
        decimal: Math.pow(10, 6),
        icon: TOSLogo,
        async getAddress() {
            return Address.parse('0:0000');
        },
        async getBalance() {
            return '0';
        }
    }
};

interface TokenData {
    balance: string;
    price: number;
    address: Address;
    hashKey: bigint;
}

interface TokenIteratorProps {
    tokenKey: Token;
    token: TokenMapValue;
    tokenData: TokenData;
}

interface TokenStore {
    // init part
    isLoading: boolean;
    initTokens: (userAddress: Address) => void,
    setTokenPrice: (token: Token, price: number) => void,

    // main storage
    tokens: {
        [key in Token]?: TokenData
    }

    // helpers
    forEachToken: (callback: (tokenIterator: TokenIteratorProps) => void) => void;
    formatToUsd: (token: Token, value?: string) => string;
    getPrice: (token: Token, value?: string) => number;
}

export const useTokens = create<TokenStore>((set, get) => {
    async function forEachToken(callback: (tokenIterator: TokenIteratorProps) => void) {
        for await (const tokenRawKey of Object.keys(TokenMap)) {
            const tokenKey = tokenRawKey as unknown as Token; // force cast to enum
            const token = TokenMap[tokenKey];
            const tokenData = get().tokens[tokenKey] as TokenData;

            await callback({ tokenKey, token, tokenData });
        }
    }

    const initTokens = async (userAddress?: Address) => {
        await forEachToken(async ({ tokenKey, token }) => {
            const address = await token.getAddress();
            const balance = userAddress ? await token.getBalance(userAddress) : '0'; // not logged yet
            const hashKey = bufferToBigInt(address.hash);

            set({
                tokens: {
                    ...get().tokens,
                    [tokenKey]: {
                        balance,
                        price: 0,
                        address,
                        hashKey
                    }
                }
            })
        });

        set({ isLoading: false });
        useBalance.getState().initBalance(userAddress);
    }

    initTokens();

    return {
        isLoading: true,
        tokens: {},
        initTokens,
        forEachToken,
        getPrice: (token, value = '') => {
            const tokenPrice = get().tokens[token]?.price || 0; // in case prices not loaded yet
            const usd = value ? parseFloat(value) * Number(tokenPrice) : 0;
            return usd;
        },
        formatToUsd: (token, value = '') => {
            const usd = get().getPrice(token, value);
            return formatUsd(usd);
        },

        setTokenPrice: (token: Token, price: Number) => {
            set({
                tokens: {
                    ...get().tokens,
                    [token]: {
                        ...get().tokens[token],
                        price
                    }
                }
            })
        }
    }

});
