import { Address } from 'ton';

export const USDT_EVAA_ADDRESS = Address.parse(import.meta.env.VITE_USDT_EVAA_ADDRESS);
export const MASTER_EVAA_ADDRESS = Address.parse(import.meta.env.VITE_MASTER_EVAA_ADDRESS);
export const TON_JETTON_ADDRESS = Address.parse(import.meta.env.VITE_TON_JETTON_ADDRESS);

export const TON_ENDPOINT = import.meta.env.VITE_TON_ENDPOINT;
export const TON_API_KEY = import.meta.env.VITE_TON_API_KEY;

export const UPDATE_INTERVAL = 30_000; // 30sec
