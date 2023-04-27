import React from 'react';
import styled from 'styled-components';
import { AuthButton } from '../../components/AuthButton/AuthButton';
import { BoldRobotoText } from '../Texts/MainTexts';
import EvaaLogo from '../../assets/pictures/evaa_logo.png'
import { TonConnectButton } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router';
import { Address } from 'ton'
import { useWallet, Action } from '@/store/wallet';
export interface HeaderProps {
    width?: string;
}

const HeaderWrapper = styled.div<{ width?: string }>`
    /* z-index: 100; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: ${props => props.width ? props.width : '90%'};
    padding-top: 2rem;

    @media only screen and (min-width: 480px){
        padding-top: 3rem;
    }
`

const IconWithTextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
`

const Image = styled.div`
    background-image: url(${EvaaLogo});
    height: 3.3rem;
    width: 3.3rem;
    margin-right: 1rem;
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: 0.5rem;
`
const HeaderButtons = styled.div`
    display: flex;
    @media only screen and (max-width: 480px){
        flex-direction: column-reverse;
    }
`
const TokensFaucet = styled.div`
    font-style: normal;
    font-weight: 400;
    height: 1.5rem;
    font-size: 1.5rem;
    color: #FFFFFF;
    text-transform: uppercase;
    text-decoration: underline;
    margin: 0.4rem 8px -0.4rem 0;
    cursor: pointer;
    @media only screen and (max-width: 480px){
    display: none;
    }
`

const Header = ({ width }: HeaderProps) => {
    const navigate = useNavigate();
    const { wallet } = useWallet();
    const getTokens = () => {
        console.log()
        fetch('https://evaa-testnet-faucet.herokuapp.com/api/v1/feed', {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: Address.parseRaw(wallet?.account.address ?? "").toString()
            })
        }).then(e => e.json()).then(e => alert(JSON.stringify(e)))
    }

    return (
        <HeaderWrapper width={width}>
            <IconWithTextWrapper onClick={() => navigate("/")}>
                <Image />
                <BoldRobotoText color='#FFFFFF'>EVAA</BoldRobotoText>
            </IconWithTextWrapper>
            <HeaderButtons>
                <TokensFaucet onClick={getTokens}>get testnet tokens</TokensFaucet >
                <AuthButton />
            </HeaderButtons>
        </HeaderWrapper>
    )
}

export default Header;
