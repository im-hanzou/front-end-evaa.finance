import { Address } from "ton";

import { MASTER_EVAA_ADDRESS, USDT_EVAA_ADDRESS } from "@/config";

import { tonClient } from "./client";
import { Minter } from "./minter";
import { Token } from "@/store/prices";

export async function getTokenAddress(token: Token): Promise<Address> {
    if (token === Token.TON) {
        return Address.parse('0:1a4219fe5e60d63af2a3cc7dce6fec69b45c6b5718497a6148e7c232ac87bd8a');
    }

    if (token === Token.USDT) {
        const contract = new Minter(USDT_EVAA_ADDRESS);
        return await tonClient.open(contract).getWalletAddress(MASTER_EVAA_ADDRESS) as Address;
    }

    // WORKAROUND
    return Address.parse('0')
}
