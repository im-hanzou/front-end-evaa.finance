import { TonClient } from "ton";

import { TON_ENDPOINT, TON_API_KEY } from '@/config';

export const tonClient = new TonClient({
    endpoint: TON_ENDPOINT,
    apiKey: TON_API_KEY,
});
