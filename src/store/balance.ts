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
import { useWallet } from './wallet';

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
    borrowBalance: number;
    supplyBalance: number;
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
    isReady: boolean;
}

export const useBalance = create<BalanceStore>((set, get) => {
    const initBalance = async (userAddress?: Address) => {
        if (userAddress) {
            set({ userAddress, isReady: false })
        }

        updateData();
    }

    const updateData = async () => {
        const { assetDataDict, assetConfigDict, dictRates, dictReserves } = await getUIVariables();
        const userContractAddress = getUserContractAddress(get()?.userAddress);
        const { aggregatedBalance1, aggregatedBalance2, isInitedUser } = !get().userAddress ? { aggregatedBalance1: BigInt(0), aggregatedBalance2: BigInt(0), isInitedUser: false } : await getAggregatedBalances({ userContractAddress, assetConfigDict, assetDataDict });
        set({ isInitedUser });

        const availableToBorrowData = isInitedUser ? await getAvailableToBorrow({ userContractAddress, assetConfigDict, assetDataDict }) : BigInt(0);

        if (get()?.userAddress) {
            const supplyBalance = Number(aggregatedBalance1) / Math.pow(10, 9);
            set({ supplyBalance });

            const borrowBalance = Number(aggregatedBalance2) / Math.pow(10, 9);
            set({ borrowBalance });


            const limitUsed = Number(borrowBalance);
            const availableToBorrow = (Math.abs(Number(availableToBorrowData)) / Math.pow(10, 9)).toFixed(2);
            set({ availableToBorrow });

            const totalLimit = limitUsed + Number(availableToBorrow);

            set({ borrowLimitValue: totalLimit });

            if (totalLimit !== 0) {
                const borrowLimitPercent = limitUsed / totalLimit;
                set({ borrowLimitPercent });
            }
        }

        const supplies: Supply[] = [];
        const borrows: Borrow[] = [];
        const mySupplies: MySupply[] = [];
        const myBorrows: MyBorrow[] = [];

        await useTokens.getState().forEachToken(async ({ tokenKey, token, tokenData }) => {
            const assetTokenData = assetDataDict.get(tokenData.hashKey);
            const ratesPerSecond = dictRates.get(tokenData.hashKey);

            // prices
            if (assetTokenData?.price) {
                const price = Number(assetTokenData?.price) / (Math.pow(10, 9));
                useTokens.getState().setTokenPrice(tokenKey, Number(price));
            }

            // supplies
            const apySupply = ratesPerSecond ? calcApy({ rate: ratesPerSecond.s_rate_per_second }) : 0;
            const accuracy = Math.max(Math.ceil(- Math.log10(1 / (Number(assetTokenData?.price) / 1e9))), 2);

            supplies.push({
                id: String(tokenKey),
                token: tokenKey,
                balance: Number(tokenData.balance).toFixed(accuracy),
                apy: apySupply,
                max: Number(tokenData.balance)
            });

            // borrows
            let maxBorrowMath = Math.abs(Number(availableToBorrowData) / Number(assetTokenData?.price));
            const assetReserve = dictReserves.get(tokenData.hashKey)?.reserve;
            const apyBorrow = ratesPerSecond ? calcApy({ rate: ratesPerSecond.b_rate_per_second }) : 0;
            const liquidity = (Math.abs(Number(assetTokenData?.balance) - Number(assetReserve)) / token.decimal).toFixed(accuracy);
            const maxBorrow = Math.min(Number(liquidity), Number(maxBorrowMath));

            if (assetReserve) {
                borrows.push({
                    id: String(tokenKey),
                    token: tokenKey,
                    liquidity,
                    apy: apyBorrow,
                    max: maxBorrow
                });
            }

            if (dictReserves.get(tokenData.hashKey)?.reserve === undefined) { //delete after creating a stable on sc
                borrows.push({
                    id: 'aa',
                    token: Token.TOS,
                    liquidity: '0',
                    apy: Number('0'),
                    max: Number('0'),
                })
            }
            if (isInitedUser) {
                // mySupplies

                const accountAssetBalance = await getAccountAssetBalance({
                    userContractAddress,
                    address: tokenData.address,
                    s_rate: assetTokenData?.s_rate,
                    b_rate: assetTokenData?.b_rate
                });
                const balanceMath = Math.abs(Number(accountAssetBalance) / token.decimal);
                const balance = balanceMath > 0.01 ? balanceMath.toFixed(accuracy) : balanceMath.toString();


                const maxWithdraw = Math.min(Number(liquidity), Math.abs(Number(accountAssetBalance) / token.decimal));

                console.log(accountAssetBalance)
                console.log(balanceMath)
                if (accountAssetBalance > 0) {
                    mySupplies.push({
                        id: String(tokenKey),
                        token: tokenKey,
                        balance,
                        apy: apySupply,
                        earned: '0',
                        max: maxWithdraw
                    });
                }

                // myBorrows
                let maxRepayMath = Number(Math.abs(Number(accountAssetBalance) / token.decimal));

                const maxRepay = Math.min(Number(tokenData.balance), maxRepayMath); //todo +t 


                if (accountAssetBalance < 0) {
                    myBorrows.push({
                        id: String(tokenKey),
                        token: tokenKey,
                        balance,
                        apy: apyBorrow,
                        accrued: '22',
                        max: maxRepay,
                    });
                }
            }
        });

        const isReady = (get()?.userAddress?.toString() && useWallet.getState().isLogged) || !useWallet.getState().isLogged;

        set({ supplies, borrows, mySupplies, myBorrows, isLoading: false, isReady });
    }

    setInterval(updateData, UPDATE_INTERVAL);

    return {
        borrowBalance: 0,
        supplyBalance: 0,
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
        isReady: true
    }
});
