import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TON_ENDPOINT, TON_API_KEY } from '@/config';

export const tonClient = async () => {
    let endpoint = '';
    endpoint = await getHttpEndpoint({ network: "testnet" });
    return new TonClient({
        endpoint
    });
}
