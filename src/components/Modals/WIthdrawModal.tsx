import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { XMarkIcon, ExclamationCircleIcon, RocketLaunchIcon } from '@heroicons/react/20/solid';
import { notification } from 'antd';

import { useWallet, Action } from '@/store/wallet';
import { Token, useTokens, TokenMap } from "@/store/tokens";
import { MySupply, useBalance } from '@/store/balance';

import ModalConfirmButton from "../ModalConfirmButton";
import { BoldRobotoText, RegularRobotoText } from "../Texts/MainTexts";
import { AmountInDollars } from "./SupplyModal";
import { formatSmallValue } from "@/utils";

const DialogStyled = styled(Dialog.Panel)`
    position: relative;
    padding: 4.5rem 3.5rem 21.8rem 3.5rem;
	background: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 59rem;
    
    @media only screen and (max-width: 480px) {
        transform: scale(0.8);
    }
`

const Title = styled(BoldRobotoText)`
    color: ${props => props.theme.black};
    font-size: 2.2rem;
    align-self: flex-start;
    margin-bottom: 3.4rem;
`

const Subtitle = styled(RegularRobotoText)`
    color: ${props => props.theme.grayLighter};
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
`

const InfoText = styled(RegularRobotoText)`
    color: ${props => props.theme.black};
    font-size: 1.8rem;
`

const HelpWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
`

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: space-between;
    width: 41.7rem;
    padding: 1.4rem 2rem;
    border: 1px solid ${props => props.theme.grayLighter};
    border-radius: 10px;
`

const InfoTextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    /* margin-top: 1rem; */
    /* margin-bottom: 1rem; */
`

const ModalBtn = styled(ModalConfirmButton)`
    position: absolute; 
    bottom: 3.5rem;
    width: 41.7rem;
`

export const MyStyledInput = styled.input`
    width: 41.7rem;
    height: 5.7rem;
    border-color: ${props => props.theme.grayLighter};
    border-width: 1px;
    border-style: solid;
    border-radius: 10px;
    color: ${props => props.theme.black};
    font-size: 1.8rem;
    padding: 1.5rem 1.5rem;; 
    margin-bottom: 3rem;
    /* margin-top: 1.8rem; */
    outline: none;
`

export const CloseButton = styled(XMarkIcon)`
    position: absolute;
    top: 2.5rem;
    right: 2.5rem;
    width: 3rem;
    height: 3rem;
    cursor: pointer;

`

interface SuppluModalProps {
    close: () => void;
    supply?: MySupply;
}

interface FormData {
    price: string;
}

export const WithdrawModal = ({ close, supply }: SuppluModalProps) => {
    const { register, handleSubmit, watch, formState: { errors, } } = useForm<FormData>();
    const { formatToUsd } = useTokens();

    const currentToken = supply?.token || Token.TON;
    const { ticker } = TokenMap[currentToken];

    const { sendTransaction, isWaitingResponse } = useWallet();

    const tokenAmount = watch("price");
    const click = async () => {
        try {
            await sendTransaction(tokenAmount, currentToken, Action.withdraw);
            
            notification.open({
                message: 'Withdraw is successful',
                description: 'The transaction will take some time to process, please do not worry',
                icon: <RocketLaunchIcon color='#0381C5' width='32px' height='32px' />,
            });

            useBalance.getState().initBalance();

            close();

        } catch {
            notification.open({
                message: 'Transaction not completed',
                description: 'The transaction was canceled by the user or another error occurred. Please, try again.',
                icon: <ExclamationCircleIcon color='red' width='32px' height='32px' />,
            }); 
        }
    }

    const isMoreMax = Number(tokenAmount) > (supply?.max || 0);

    return (
        <Dialog.Panel as={DialogStyled}>
            <CloseButton onClick={close} />
            <Title>Withdraw {ticker}</Title>
            <HelpWrapper>
                <Subtitle>Amount</Subtitle>
                <MyStyledInput type='number' step='any' max={supply?.max} maxLength={7}  {...register('price', { required: true, pattern: /^(0|[1-9]\d*)(\.\d+)?$/ })} placeholder="Enter amount" />
                {watch("price") && <AmountInDollars>{formatToUsd(currentToken, watch("price"))}</AmountInDollars>}
            </HelpWrapper>
            <HelpWrapper>
                <Subtitle>Transaction Overview</Subtitle>
                <InfoWrapper>
                    <InfoTextWrapper>
                        <InfoText>MAX</InfoText>
                        <InfoText>{formatSmallValue(supply?.max || 0)} {ticker}</InfoText>
                    </InfoTextWrapper>
                    {/* <InfoTextWrapper>
                            <InfoText>Supply APY</InfoText>
                            <InfoText>3.12%</InfoText>
                        </InfoTextWrapper> */}
                </InfoWrapper>
            </HelpWrapper>
            <ModalBtn loading={isWaitingResponse} disabled={isMoreMax || !tokenAmount} onClick={click}>Withdraw</ModalBtn>
        </Dialog.Panel>
    )
}
