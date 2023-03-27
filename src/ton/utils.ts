import { CHAIN } from '@tonconnect/sdk';
import Prando from 'prando';
import { Address } from 'ton';

export function bufferToBigInt(buffer: any, start = 0, end = buffer.length) {
    const bufferAsHexString = buffer.slice(start, end).toString("hex");
    return BigInt(`0x${bufferAsHexString}`);
}

export function hexToString(hex: string): string {
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str.replaceAll('\u0000', '');
}

export function friendlifyUserAddress(address: string | null | undefined, chain?: CHAIN) {
	if (!address) {
		return '';
	}

	const userFriendlyAddress = Address.parseRaw(address).toString({ testOnly: chain === CHAIN.TESTNET });

	return userFriendlyAddress.slice(0, 4) + '...' + userFriendlyAddress.slice(-3);
}

export function randomAddress(seed: string, workchain?: number) {
	const random = new Prando(seed);
	const hash = Buffer.alloc(32);
	for (let i = 0; i < hash.length; i++) {
		hash[i] = random.nextInt(0, 256);
	}
	return new Address(workchain ?? 0, hash);
}

export function calcApy({ rate}: {rate: bigint}) {
    return Number(((rate * BigInt(360) * BigInt(24) + BigInt(1)) ^ BigInt(365) - BigInt(1))) / Math.pow(10, 16);
}