import { Address, beginCell, Dictionary, TupleBuilder } from "ton";

import { tonClient } from "./client";

interface getAggregatedBalancesProps {
    userContractAddress: Address;
    assetDataDict: Dictionary<any, any>;
    assetConfigDict: Dictionary<any, any>;
}

interface getAggregatedBalancesResponse {
    aggregatedBalance1: bigint;
    aggregatedBalance2: bigint;
    isInitedUser: boolean;
}

export async function getAggregatedBalances({ userContractAddress, assetDataDict, assetConfigDict }: getAggregatedBalancesProps): Promise<getAggregatedBalancesResponse> {
    const assetDataCell = beginCell().storeDictDirect(assetDataDict).endCell();
    const assetConfigCell = beginCell().storeDictDirect(assetConfigDict).endCell();

    let argsUserBalanceas = new TupleBuilder();

    argsUserBalanceas.writeCell(assetConfigCell);
    argsUserBalanceas.writeCell(assetDataCell);

    let aggregatedBalance1 = BigInt(0);
    let aggregatedBalance2 = BigInt(0);
    let isInitedUser = false;

    try {
        const getAggregatedBalances = await tonClient.runMethod(
            userContractAddress,
            'getAggregatedBalances',
            argsUserBalanceas.build(),
        );
        aggregatedBalance1 = BigInt(getAggregatedBalances.stack.readNumber());// agregatedbalances 
        aggregatedBalance2 = BigInt(getAggregatedBalances.stack.readNumber());// agregatedbalances   
        isInitedUser = true;
    } catch (e) {
        console.log('error with getAggregatedBalances', e)
    }
    console.log(aggregatedBalance1)
    console.log(aggregatedBalance2)
    console.log(isInitedUser)
    return {
        aggregatedBalance1,
        aggregatedBalance2,
        isInitedUser
    };
}
