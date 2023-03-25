import { Address, TupleBuilder } from "ton";

import { tonClient } from "./client";

interface getAccountAssetBalanceProps {
    userContractAddress: Address;
    address: Address;
    s_rate: number;
    b_rate: number;
}

export async function getAccountAssetBalance({ userContractAddress, address, s_rate, b_rate }: getAccountAssetBalanceProps): Promise<bigint> {
    const argsUser = new TupleBuilder();
    argsUser.writeAddress(address);
    argsUser.writeNumber(s_rate);
    argsUser.writeNumber(b_rate);

    let accountAssetBalance = BigInt(0);

    try {
        const accountAssetBalanceUsdt = await tonClient.runMethod(
            userContractAddress,
            'getAccountAssetBalance',
            argsUser.build(),
        );

        accountAssetBalance = BigInt(accountAssetBalanceUsdt.stack.readNumber());
    } catch (e) {
        console.log('error with getAccountAssetBalance', e)
    }

    return accountAssetBalance;
}