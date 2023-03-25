import { create } from 'zustand';
import { Address } from 'ton';

import { getUserContractAddress } from '@/ton/getUserContractAddress';
import { getTokenAddress } from '@/ton/getTokenAddress';

import { Token } from './prices';
import { getUIVariables } from '@/ton/getUIVariables';
import { getAccountAssetBalance } from '@/ton/getAccountAssetBalance';
import { getAvailableToBorrow } from '@/ton/getAvailableToBorrow';
import { getAggregatedBalances } from '@/ton/getAggregatedBalances';
import { bufferToBigInt, calcApy } from '@/ton/utils';

const USDT_DECIMAL = Math.pow(10, 6);
const TON_DECIMAL = Math.pow(10, 9);

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
}

interface BalanceStore {
    borrowBalance: string;
    supplyBalance: string;
    availableToBorrow: string;
    borrowLimitPercent: number;
    borrowLimitValue: number;

    maxBorrow: {
        [key in Token]?: number
    },
    maxRepay: {
        [key in Token]?: number
    };
    apyBorrow: {
        [key in Token]?: number
    }
    mySupplies: MySupply[];
    myBorrows: MyBorrow[];
    supplies: Supply[];
    borrows: Borrow[];

    tonBalance: string;
    usdtBalance: string;
    userAddress?: Address;
    forceUpdateData: () => void;
    isInitedUser: boolean;
}

export const useBalance = create<BalanceStore>((set, get) => {

    const updateData = async () => {
        const userContractAddress = getUserContractAddress(get().userAddress);
        const usdtAddress = await getTokenAddress(Token.USDT);
        const tonAddress = await getTokenAddress(Token.TON);
        
        const usdtKey = bufferToBigInt(usdtAddress.hash);
        const tonKey = bufferToBigInt(tonAddress.hash);

        const { assetDataDict, assetConfigDict, dictRates, dictReserves } = await getUIVariables();
        
        const usdtData = assetDataDict.get(usdtKey);
        const tonData = assetDataDict.get(tonKey);

        const accountAssetBalanceUsdtData = await getAccountAssetBalance({ userContractAddress, address: usdtAddress, s_rate: usdtData.s_rate, b_rate: usdtData.b_rate })
        const accountAssetBalanceTonData = await getAccountAssetBalance({ userContractAddress, address: tonAddress, s_rate: tonData.s_rate, b_rate: tonData.b_rate })
        
        const availableToBorrowData = await getAvailableToBorrow({ userContractAddress, assetConfigDict, assetDataDict });
        const { aggregatedBalance1, aggregatedBalance2, isInitedUser } = await getAggregatedBalances({ userContractAddress, assetConfigDict, assetDataDict });
        set({ isInitedUser });

        const ratesPerSecondDataUsdt = dictRates.get(usdtKey);
        const ratesPerSecondDataTon = dictRates.get(tonKey);

        const apySupplyUsdt = calcApy({rate: ratesPerSecondDataUsdt.s_rate_per_second });
        const apySupplyTon = calcApy({rate: ratesPerSecondDataTon.s_rate_per_second });

        const supplies = [{
            id: 'dkdskasdk',
            token: Token.TON,
            balance: Number(get().tonBalance).toFixed(2),
            apy: Number(apySupplyTon / 100),
            max: Number(get().tonBalance)
        }, {
            id: 'dkdskas123123dk',
            token: Token.USDT,
            balance: Number(get().usdtBalance).toFixed(2),
            apy: Number(apySupplyUsdt),
            max: Number(get().usdtBalance)
        },
        {
            id: 'dkdskas123123d112k',
            token: Token.TOS,
            balance: '0',
            apy: 0,
            max: 0,
        }];

        set({ supplies });

        const apyBorrowUsdt = calcApy({ rate: ratesPerSecondDataUsdt.b_rate_per_second });
        const apyBorrowTon = calcApy({ rate: ratesPerSecondDataTon.b_rate_per_second });

        set({ apyBorrow: { [Token.TON]: apyBorrowTon, [Token.USDT]: apyBorrowUsdt } });

        const assetReserveUsdt = dictReserves.get(usdtKey).reserve;
        const assetReserveTon = dictReserves.get(tonKey).reserve;

        const liquidity_usdt = (Math.abs(Number(usdtData.balance) - Number(assetReserveUsdt)) / USDT_DECIMAL).toFixed(2);
        const liquidity_ton = (Math.abs(Number(tonData.balance) - Number(assetReserveTon)) / TON_DECIMAL).toFixed(2);

        const borrows = [{
            id: '1211ccc1',
            token: Token.USDT,
            liquidity: liquidity_usdt,
            apy: apyBorrowUsdt,
        },
        {
            id: '1211ccc1121',
            token: Token.TON,
            liquidity: liquidity_ton,
            apy: apyBorrowTon,
        },
        {
            id: '1211ccc11212311',
            token: Token.TOS,
            liquidity: '0',
            apy: 0,
        }];

        set({ borrows })

        ///////////////////////////////////
        if (!get()?.userAddress) {

            // not initialized yet, just skip this update cycle
            return;
        }

        const supplyBalance = (Number(aggregatedBalance1) / TON_DECIMAL / 10).toString();
        set({ supplyBalance });

        const borrowBalance = (Number(aggregatedBalance2) / TON_DECIMAL).toString();
        set({ borrowBalance });

        const limitUsed = (Number(availableToBorrowData) / TON_DECIMAL);
        const totalLimit = limitUsed + Number(borrowBalance);

        set({ borrowLimitValue: totalLimit });
        if (totalLimit !== 0) {
            const borrowLimitPercent = Math.abs(limitUsed) / totalLimit;
            set({ borrowLimitPercent });
        }

        const maxWithdrawUsdt = Math.abs(Number(usdtData.balance) / USDT_DECIMAL);
        const maxWithdrawTon = Math.abs(Number(tonData.balance) / TON_DECIMAL);

        const newMySupply = [
            accountAssetBalanceTonData > 0 ? {
                id: 'fir12312321st',
                token: Token.TON,
                balance: Number(accountAssetBalanceTonData / BigInt(TON_DECIMAL)).toFixed(2),
                apy: apySupplyTon,
                earned: '13',
                max: maxWithdrawTon
            } : null,
            
            accountAssetBalanceUsdtData > 0 ? {
                id: 'fiasdflllr12312321st',
                token: Token.USDT,
                balance: Number(accountAssetBalanceUsdtData / BigInt(USDT_DECIMAL)).toFixed(2),
                apy: apySupplyUsdt,
                earned: '14',
                max: maxWithdrawUsdt
            } : null];

        const mySupplies = get().isInitedUser ? newMySupply.filter(e => e) : [];
        //@ts-ignore
        set({ mySupplies });
    

        const myBorrows = [
            accountAssetBalanceUsdtData < 0 ? {
                id: 'firs12122t',
                token: Token.USDT,
                balance: Math.abs(Number(accountAssetBalanceUsdtData / BigInt(USDT_DECIMAL))).toFixed(2),
                apy: apyBorrowUsdt,
                accrued: '22',
            } : null, accountAssetBalanceTonData < 0 ? {
                id: 'fasdfirs12122t',
                token: Token.TON,
                balance: Math.abs(Number(accountAssetBalanceTonData / BigInt(TON_DECIMAL))).toFixed(2),
                apy: apyBorrowTon,
                accrued: '10',
            } : null];
            
        //@ts-ignore
        set({ myBorrows: get().isInitedUser ? myBorrows.filter(e => e) : [] });

        const maxBorrowUsdt = Math.abs(Number(availableToBorrowData) / Number(usdtData.price));
        const maxBorrowTon = Math.abs(Number(availableToBorrowData) / Number(tonData.price));
        set({ maxBorrow: { [Token.TON]: maxBorrowTon, [Token.USDT]: maxBorrowUsdt } });

        const maxRepayUsdt = Number(Number(get().usdtBalance).toFixed(2)); //todo +t 
        const maxRepayTon = Number(Number(get().tonBalance).toFixed(2)); //todo +t
        set({ maxRepay: { [Token.TON]: maxRepayTon, [Token.USDT]: maxRepayUsdt } });
    }

    setInterval(updateData, 30000);
    setTimeout(updateData, 2000)

    return {
        borrowBalance: '0',
        supplyBalance: '0',
        borrowLimitPercent: 0,
        borrowLimitValue: 0,
        availableToBorrow: '0',
        maxBorrow: {},
        maxRepay: {},
        mySupplies: [],
        myBorrows: [],
        supplies: [],
        borrows: [],
        apyBorrow: {},
        tonBalance: '0',
        usdtBalance: '0',
        forceUpdateData: updateData,
        isInitedUser: false,
    }
});
