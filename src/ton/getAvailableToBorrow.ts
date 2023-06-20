import { Address, beginCell, Dictionary, TupleBuilder } from "ton";

import { tonClient } from "./client";

interface getAvailableToBorrowProps {
    userContractAddress: Address;
    assetDataDict: Dictionary<any, any>;
    assetConfigDict: Dictionary<any, any>;
}

export async function getAvailableToBorrow({ userContractAddress, assetDataDict, assetConfigDict }: getAvailableToBorrowProps): Promise<bigint> {
    const assetDataCell = beginCell().storeDictDirect(assetDataDict).endCell();
    const assetConfigCell = beginCell().storeDictDirect(assetConfigDict).endCell();

    let argsUserAvl = new TupleBuilder();
    argsUserAvl.writeCell(assetConfigCell);
    argsUserAvl.writeCell(assetDataCell);

    let availableToBorrowData = BigInt(0);
    try {
        let stackUserAvlToBorr = await (await tonClient()).runMethod(
            userContractAddress,
            'getAvailableToBorrow',
            argsUserAvl.build(),
        );

        availableToBorrowData = BigInt(stackUserAvlToBorr.stack.readNumber());
    } catch (e) {
        console.log('error with getAvailableToBorrow', e)
    }

    return availableToBorrowData;
}