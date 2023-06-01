import { AssetCardLogo, AssetCardText, AssetCardTextMobileHide, AssetCardTextSimple, AssetCardWrapper, AssetWrapper, DoubleTextLower, DoubleTextUpper, DoubleTextWrapper, DoubleTextWrapperMobileHide } from './AssetCardStyles';
import { AssetCardButton } from '../../AssetCardButton';

import { Token, useTokens, TokenMap } from '@/store/tokens';
import { formatPercent, formatValue } from '@/utils';

export interface AssetCardProps {
    token: Token;
    balance?: string;
    apy: number;
    earned?: string;
    accrued?: string,
    liquidity?: string;
    onClick?: () => void;
}

export const SupplyAssetCard = ({ onClick, token, balance, apy } : AssetCardProps) => {    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TokenMap[token].icon}/>
                <AssetCardTextSimple>{TokenMap[token].ticker}</AssetCardTextSimple>
            </AssetWrapper>
            <AssetCardText right={42.5}>{formatValue(balance)} {TokenMap[token].ticker}</AssetCardText>
            <AssetCardTextMobileHide right={30.1}>{formatPercent(apy)}</AssetCardTextMobileHide>
            <AssetCardButton disabled={TokenMap[token].ticker === 'TOS'} onClick={onClick} right={0}>Supply</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const MySuppliesAssetCard = ({ onClick, token, balance, apy, earned } : AssetCardProps) => {    
    const {formatToUsd} = useTokens();
    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TokenMap[token].icon}/>
                <AssetCardTextSimple>{TokenMap[token].ticker}</AssetCardTextSimple>
            </AssetWrapper>
            <DoubleTextWrapper right={42.5}>
                <DoubleTextUpper>{formatValue(balance)} {TokenMap[token].ticker}</DoubleTextUpper>
                <DoubleTextLower>{formatToUsd(token, balance)}</DoubleTextLower>
            </DoubleTextWrapper>
            <DoubleTextWrapperMobileHide right={30.1}>
                <DoubleTextUpper>{formatPercent(apy)}</DoubleTextUpper>
            </DoubleTextWrapperMobileHide>
            <AssetCardButton onClick={onClick} right={0}>Withdraw</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const BorrowAssetCard = ({ onClick, token, liquidity, apy} : AssetCardProps) => {    
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TokenMap[token].icon}/>
                <AssetCardTextSimple>{TokenMap[token].ticker}</AssetCardTextSimple>
            </AssetWrapper>
            <AssetCardText right={42.5}>{formatValue(liquidity)} {TokenMap[token].ticker}</AssetCardText>
            <AssetCardTextMobileHide right={30.1}>{formatPercent(apy)}</AssetCardTextMobileHide>
            <AssetCardButton disabled={TokenMap[token].ticker === 'TOS'} onClick={onClick} right={0}>Borrow</AssetCardButton>
        </AssetCardWrapper>
    )
}

export const MyBorrowsAssetCard = ({ onClick, token, balance, apy, accrued} : AssetCardProps) => {    
    const {formatToUsd} = useTokens();
    return (
        <AssetCardWrapper>
            <AssetWrapper>
                <AssetCardLogo src={TokenMap[token].icon}/>
                <AssetCardTextSimple>{TokenMap[token].ticker}</AssetCardTextSimple>
            </AssetWrapper>
            <DoubleTextWrapper right={42.5}>
                <DoubleTextUpper>{formatValue(balance)} {TokenMap[token].ticker}</DoubleTextUpper>
                <DoubleTextLower>{formatToUsd(token, balance)}</DoubleTextLower>
            </DoubleTextWrapper>
            <DoubleTextWrapperMobileHide right={30.1}>
                <DoubleTextUpper>{formatPercent(Number((parseFloat(apy.toString())).toFixed(4)))}</DoubleTextUpper>
                {/* <DoubleTextLower>{accrued} {TokenMap[token].ticker}</DoubleTextLower> */}
            </DoubleTextWrapperMobileHide>
            {/* disabled={Number(balance) === 0} */}
            <AssetCardButton  onClick={onClick} right={0}>Repay</AssetCardButton>
        </AssetCardWrapper>
    )
}

