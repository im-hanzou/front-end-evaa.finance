import { create } from 'zustand';
import { Address } from 'ton';

import { UPDATE_INTERVAL } from '@/config';
import { getUserContractAddress } from '@/ton/getUserContractAddress';
import { getUIVariables } from '@/ton/getUIVariables';
import { getAccountAssetBalance } from '@/ton/getAccountAssetBalance';
import { getAvailableToBorrow } from '@/ton/getAvailableToBorrow';
import { getAggregatedBalances } from '@/ton/getAggregatedBalances';
import { calcApy } from '@/ton/utils';

import { Token, useTokens } from './tokens';

export interface MySupply {
    id: string;
    token: Token;
    balance: string;
    apy: number;
    earned: string;
    max: number;
}

export interface MyBorrow {
    id: string;
    token: Token;
    balance: string;
    apy: number;
    accrued: string;
    max: number;    
}

export interface Supply {
    id: string;
    token: Token;
    balance: string;
    apy: number;
    max: number;
}

export interface Borrow {
    id: string;
    token: Token;
    liquidity: string;
    apy: number;
    max: number;
}

interface BalanceStore {
    borrowBalance: string;
    supplyBalance: string;
    availableToBorrow: string;
    borrowLimitPercent: number;
    borrowLimitValue: number;

    // base storage
    mySupplies: MySupply[];
    myBorrows: MyBorrow[];
    supplies: Supply[];
    borrows: Borrow[];

    // support
    userAddress?: Address;
    initBalance: (userAddress?: Address) => void;
    isInitedUser: boolean;
    isLoading: boolean;
}

export const useBalance = create<BalanceStore>((set, get) => {
    const initBalance = async (userAddress?: Address) => {
        if (userAddress) {
            set({ userAddress })
        }

        updateData();
    }


    const updateData = async () => {
        const { assetDataDict, assetConfigDict, dictRates, dictReserves } = await getUIVariables();

        const userContractAddress = getUserContractAddress(get().userAddress);
        const { aggregatedBalance1, aggregatedBalance2, isInitedUser } = await getAggregatedBalances({ userContractAddress, assetConfigDict, assetDataDict });
        set({ isInitedUser });

        const availableToBorrowData = isInitedUser ? await getAvailableToBorrow({ userContractAddress, assetConfigDict, assetDataDict }) : BigInt(0);  

        if (get()?.userAddress) {
            const supplyBalance = (Number(aggregatedBalance1) / Math.pow(10, 10)).toString();
            set({ supplyBalance });

            const borrowBalance = (Number(aggregatedBalance2) / Math.pow(10, 9)).toString();
            set({ borrowBalance });

            const limitUsed = (Number(availableToBorrowData) / Math.pow(10, 9));
            const totalLimit = limitUsed + Number(borrowBalance);

            set({ borrowLimitValue: totalLimit });
            if (totalLimit !== 0) {
                const borrowLimitPercent = Math.abs(limitUsed) / totalLimit;
                set({ borrowLimitPercent });
            }
        }

        const supplies: Supply[] = [];
        const borrows: Borrow[] = [];
        const mySupplies: MySupply[] = [];
        const myBorrows: MyBorrow[] = [];

        await useTokens.getState().forEachToken(async ({tokenKey, token, tokenData}) => {
            const assetTokenData = assetDataDict.get(tokenData.hashKey);
            const ratesPerSecond = dictRates.get(tokenData.hashKey);
            
            // prices
            if (assetTokenData?.price) {
                const price = BigInt(assetTokenData?.price) / BigInt(Math.pow(10, 9));
                
                useTokens.getState().setTokenPrice(tokenKey, Number(price));
            }

            // supplies
            const apySupply = ratesPerSecond ? calcApy({rate: ratesPerSecond.s_rate_per_second }) : 0;

            supplies.push({
                id: String(tokenKey),
                token: tokenKey,
                balance: Number(tokenData.balance).toFixed(2),
                apy: apySupply,
                max: Number(tokenData.balance)
            });

            // borrows
            const assetReserve = dictReserves.get(tokenData.hashKey)?.reserve;

            const apyBorrow = ratesPerSecond ? calcApy({ rate: ratesPerSecond.b_rate_per_second }) : 0;
            const maxBorrow = Math.abs(Number(availableToBorrowData) / Number(assetTokenData?.price));
            const liquidity = (Math.abs(Number(assetTokenData?.balance) - Number(assetReserve)) / token.decimal).toFixed(2);

            if (assetReserve) {
                borrows.push({
                    id: String(tokenKey),
                    token: tokenKey,
                    liquidity,
                    apy: apyBorrow,
                    max: maxBorrow
                });
            }

            if (isInitedUser) {
                // mySupplies
                const maxWithdraw = Math.abs(Number(assetTokenData?.balance) / token.decimal);

                const accountAssetBalance = await getAccountAssetBalance({
                    userContractAddress,
                    address: tokenData.address,
                    s_rate: assetTokenData?.s_rate,
                    b_rate: assetTokenData?.b_rate
                });

                const balance = Math.abs(Number(accountAssetBalance / BigInt(token.decimal))).toFixed(2);

                if (accountAssetBalance > 0) {
                    mySupplies.push({
                        id: String(tokenKey),
                        token: tokenKey,
                        balance,
                        apy: apySupply,
                        earned: '13',
                        max: maxWithdraw
                    });
                }
                
                // myBorrows
                const maxRepayUsdt = Number(tokenData.balance).toFixed(2); //todo +t 

                if (accountAssetBalance < 0) {
                    myBorrows.push({
                        id: String(tokenKey),
                        token: tokenKey,
                        balance,
                        apy: apyBorrow,
                        accrued: '22',
                        max: Number(maxRepayUsdt)
                    });
                }
            }
        });
        
        set({ supplies, borrows, mySupplies, myBorrows, isLoading: false });
    }

    setInterval(updateData, UPDATE_INTERVAL);

    return {
        borrowBalance: '0',
        supplyBalance: '0',
        borrowLimitPercent: 0,
        borrowLimitValue: 0,
        availableToBorrow: '0',

        mySupplies: [],
        myBorrows: [],
        supplies: [],
        borrows: [],

        initBalance,
        isInitedUser: false,
        isLoading: true,
    }
});
