export function isMobile(): boolean {
	return window.innerWidth <= 480;
}

export function isDesktop(): boolean {
	return window.innerWidth >= 1050;
}

export function openLink(href: string, target = '_self') {
	window.open(href, target, 'noreferrer noopener');
}

export function addReturnStrategy(url: string, returnStrategy: 'back' | 'none'): string {
	const link = new URL(url);
	link.searchParams.append('ret', returnStrategy);
	return link.toString();
}

export function formatPercent(value: number = 0) {
	return `${(value * 100).toFixed(2)} %`
}

export function formatUsd(value: string | number) {
	const usd = Number(value);
	return `$${usd.toFixed(2)}`
}

export function abbrNum(number: any, decPlaces: number) {
    decPlaces = Math.pow(10,decPlaces);
    var abbrev = [ "k", "m", "b", "t" ];
    for (var i=abbrev.length-1; i>=0; i--) {
        var size = Math.pow(10,(i+1)*3);
        if(size <= number) {
             number = Math.round(number*decPlaces / size) / decPlaces;
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }
             number += abbrev[i];
             break;
        }
    }
    return number;
}
