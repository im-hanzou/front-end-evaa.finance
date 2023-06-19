import { Address, TupleBuilder } from "ton";

import { bufferToBigInt } from '@/ton/utils';
import { tonClient } from "./client";

interface getAccountAssetBalanceProps {
    userContractAddress: Address;
    address: Address;
    s_rate: number;
    b_rate: number;
}

export async function getAccountAssetBalance({ userContractAddress, address, s_rate, b_rate }: getAccountAssetBalanceProps): Promise<bigint> {
    const argsUser = new TupleBuilder();
    argsUser.writeNumber(bufferToBigInt(address.hash));
    argsUser.writeNumber(s_rate);
    argsUser.writeNumber(b_rate);

    let accountAssetBalance = BigInt(0);

    try {
        const accountAssetBalanceUsdt = await (await tonClient()).runMethod(
            userContractAddress,
            'getAccountAssetBalance',
            argsUser.build(),
        );
        accountAssetBalance = BigInt(accountAssetBalanceUsdt.stack.readNumber());

    } catch {
        console.info(`user balance for ${address.toString()} not present`)
    }

    return accountAssetBalance;
}
