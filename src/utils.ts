import { CHAIN } from '@tonconnect/sdk';
import { Address } from 'ton';

export function isMobile(): boolean {
	return window.innerWidth <= 480;
}

export function isDesktop(): boolean {
	return window.innerWidth >= 1050;
}

export function openLink(href: string, target = '_self') {
	window.open(href, target, 'noreferrer noopener');
}

export function friendlifyUserAddress(address: string | null | undefined, chain?: CHAIN) {
	if (!address) {
		return '';
	}

	const userFriendlyAddress = Address.parseRaw(address).toString({ testOnly: chain === CHAIN.TESTNET });

	return userFriendlyAddress.slice(0, 4) + '...' + userFriendlyAddress.slice(-3);
}

export function addReturnStrategy(url: string, returnStrategy: 'back' | 'none'): string {
	const link = new URL(url);
	link.searchParams.append('ret', returnStrategy);
	return link.toString();
}

export function formatPercent(value: number) {
	return `${value*100} %`
}