import { Dictionary, Slice, beginCell } from "ton";

import { MASTER_EVAA_ADDRESS } from "@/config";

import { tonClient } from "./client";
import { hexToString } from "./utils";

export async function getUIVariables() {
    let { stack } = await tonClient.runMethod(
        MASTER_EVAA_ADDRESS,
        'getUIVariables',
    );
    
    // 1 ------ASSET DATA---------
    const assetDataDict = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
        serialize: (src: any, buidler: any) => {
            buidler.storeUint(src.price, 64);
            buidler.storeUint(src.s_rate, 64);
            buidler.storeUint(src.b_rate, 64);
            buidler.storeUint(src.totalSupply, 64);
            buidler.storeUint(src.totalBorrow, 64);
            buidler.storeUint(src.lastAccural, 32);
            buidler.storeUint(src.balance, 64);
        },
        parse: (src: Slice) => {
            const price = BigInt(src.loadUint(64));
            const s_rate = BigInt(src.loadUint(64));
            const b_rate = BigInt(src.loadUint(64));
            const totalSupply = BigInt(src.loadUint(64));
            const totalBorrow = BigInt(src.loadUint(64));
            const lastAccural = BigInt(src.loadUint(32));
            const balance = BigInt(src.loadUint(64));

            return { price, s_rate, b_rate, totalSupply, totalBorrow, lastAccural, balance };
        }
        //@ts-ignore
    }, stack.readCellOpt());
    
    // 2 -----------POOL METADATA----
    //@ts-ignore
    const conf = stack.pop().cell.beginParse();
    const metadata = hexToString(conf.loadRef().beginParse().toString());

    // 3 -------ASSET CONFIG-------
    conf.loadRef();
    const confItems = conf.loadRef().beginParse();
    
    const assetConfigDict = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), { //asset config
        serialize: (src: any, buidler: any) => {
            buidler.storeAddress(src.oracle);
            buidler.storeUint(src.decimals, 8);
            const refBuild = beginCell();
            refBuild.storeUint(src.collateralFactor, 16);
            refBuild.storeUint(src.liquidationThreshold, 16);
            refBuild.storeUint(src.liquidationPenalty, 16);
            refBuild.storeUint(src.baseBorrowRate, 64);
            refBuild.storeUint(src.borrowRateSlopeLow, 64);
            refBuild.storeUint(src.borrowRateSlopeHigh, 64);
            refBuild.storeUint(src.supplyRateSlopeLow, 64);
            refBuild.storeUint(src.supplyRateSlopeHigh, 64);
            refBuild.storeUint(src.targeUtilization, 64);
            buidler.storeRef(refBuild.endCell())
        },
        parse: (src: Slice) => {
            const oracle = src.loadAddress();                     //store_slice(oracle)
            const decimals = BigInt(src.loadUint(8));             //.store_uint(decimals, 8)
            const ref = src.loadRef().beginParse();               //.store_ref(begin_cell()
            const collateralFactor = BigInt(ref.loadUint(16));    //.store_uint(collateral_factor, 16) 
            const liquidationThreshold = BigInt(ref.loadUint(16));//.store_uint(liquidation_threshold, 16) 
            const liquidationPenalty = BigInt(ref.loadUint(16));  // .store_uint(liquidation_penalty, 16)
            const baseBorrowRate = BigInt(ref.loadUint(64));      //.store_uint(base_borrow_rate, 64) 
            const borrowRateSlopeLow = BigInt(ref.loadUint(64));  //.store_uint(borrow_rate_slope_low, 64) 
            const borrowRateSlopeHigh = BigInt(ref.loadUint(64)); //.store_uint(supply_rate_slope_low, 64) 
            const supplyRateSlopeLow = BigInt(ref.loadUint(64));  //.store_uint(supply_rate_slope_low, 64) 
            const supplyRateSlopeHigh = BigInt(ref.loadUint(64)); //.store_uint(supply_rate_slope_high, 64) 
            const targeUtilization = BigInt(ref.loadUint(64));    //.store_uint(target_utilization, 64) 
            
            return {
                oracle, decimals, collateralFactor, liquidationThreshold,
                liquidationPenalty, baseBorrowRate, borrowRateSlopeLow,
                borrowRateSlopeHigh, supplyRateSlopeLow, supplyRateSlopeHigh, targeUtilization
            };
        }
        //@ts-ignore
    }, confItems.loadRef().beginParse());
    
    // get asset config by address
    
    // 4 -----------IS POOL ACTIVE?----
    //if pool active = -1 (true) / 0 (false)
    const isPoolActive = confItems.loadInt(8) === -1;
    
    // 5 ----SRATE BRATE PER SEC BY ASSET----
    const dictRates = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
        serialize: (src: any, buidler: any) => {
            buidler.storeSlice(src);
        },
        parse: (src: Slice) => {
            const s_rate_per_second = BigInt(src.loadUint(64)); //s_rate_per_second 64bit
            const b_rate_per_second = BigInt(src.loadUint(64)); //b_rate_per_second 64bit
            return { s_rate_per_second, b_rate_per_second };
        }
    }, stack.readCellOpt())
    
    
    // 6 ---------RESERVE BY ASSET------
    const dictReserves = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), {
        serialize: (src: any, buidler: any) => {
            buidler.storeSlice(src);
        },
        parse: (src: Slice) => {
            const reserve = BigInt(src.loadInt(65)); //s_rate_per_second 64bit
            return { reserve };
        }
    }, stack.readCellOpt())

    const output = {
        dictReserves: dictReserves,
        dictRates: dictRates,
        isPoolActive: isPoolActive,
        assetConfigDict: assetConfigDict,
        assetDataDict: assetDataDict,
        metadata: metadata,
    }

    console.info('output', output);

    return output;
}