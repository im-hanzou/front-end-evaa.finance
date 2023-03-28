import React from 'react';
import { BorderDivBottom, BorderDivTop, AssetsDescriptionBarWrapper, AssetsDescriptionText, AssetsDescriptionTextMobileHide } from './AssetsDescriptionBarStyles';


export interface AssetsDescriptionBarProps { }

export const SupplyDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionTextMobileHide>Asset</AssetsDescriptionTextMobileHide>
            <AssetsDescriptionText right={42.5}>Wallet Balance</AssetsDescriptionText>
            <AssetsDescriptionTextMobileHide right={30.6}>APY</AssetsDescriptionTextMobileHide>
        </AssetsDescriptionBarWrapper>
    )
}

export const MySuppliesDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionTextMobileHide>Asset</AssetsDescriptionTextMobileHide>
            <AssetsDescriptionText right={42.5}>Balance</AssetsDescriptionText>
            <AssetsDescriptionTextMobileHide right={30.6}>APY</AssetsDescriptionTextMobileHide>
        </AssetsDescriptionBarWrapper>
    )
}

export const BorrowDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionTextMobileHide>Asset</AssetsDescriptionTextMobileHide>
            <AssetsDescriptionText right={42.5}>Liquidity</AssetsDescriptionText>
            <AssetsDescriptionTextMobileHide right={30.6}>APY</AssetsDescriptionTextMobileHide>
        </AssetsDescriptionBarWrapper>
    )
}
export const MyBorrowsDescriptionBar = ({} : AssetsDescriptionBarProps) => {    
    return (
        <AssetsDescriptionBarWrapper>
            <AssetsDescriptionTextMobileHide>Asset</AssetsDescriptionTextMobileHide>
            <AssetsDescriptionText right={42.5}>Balance</AssetsDescriptionText>
            <AssetsDescriptionTextMobileHide right={30.6}>APY</AssetsDescriptionTextMobileHide>
        </AssetsDescriptionBarWrapper>
    )
}

