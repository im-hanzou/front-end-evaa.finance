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

export function formatSmallValue(value: string | number) {
    if (Number(value) > 0.00001) {
        return value;
    } else {

        const decimalsPart = value?.toString()?.split('.')?.[1] || '';
        const eDecimals = Number(decimalsPart?.split('e-')?.[1]) || 0;
        const countOfDecimals = decimalsPart.length + eDecimals;
        if (countOfDecimals > 9) {
            return Number(value).toFixed(countOfDecimals - (countOfDecimals - eDecimals - 1));
        } else {
            return Number(value).toFixed(countOfDecimals);
        }
    }
}

export function formatLargeValue(number: any, decPlaces: number) {
    decPlaces = Math.pow(10, decPlaces);
    var abbrev = ["K", "M", "B", "T"];
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= number) {
            number = Math.round(number * decPlaces / size) / decPlaces;
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }
            number += abbrev[i];
            break;
        }
    }
    return number;
}

export function formatValue(value: any) {
    // return value;
    // return (value < 0.00001 ) ? '≤0.00001' : formatLargeValue(value, 2) ;
    return value == 0 ? value :
        (value > 0.0001) ? formatLargeValue(value, 2) : '≤0.0001';
}
