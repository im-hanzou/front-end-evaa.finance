import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { XMarkIcon, ExclamationCircleIcon, RocketLaunchIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { notification } from 'antd';

import { formatPercent, formatSmallValue, formatUsd } from "@/utils";
import { Token, TokenMap, useTokens } from "@/store/tokens";
import { useWallet, Action } from '@/store/wallet';
import { MyBorrow, useBalance } from "@/store/balance";

import { AmountInDollars } from "./SupplyModal";
import ModalConfirmButton from "../ModalConfirmButton";
import { BoldRobotoText, RegularRobotoText } from "../Texts/MainTexts";


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

const InfoTextBlue = styled(InfoText)`
    color: ${props => props.theme.blue};
    display: inline;
`

const ArrowRight = styled(ArrowLongRightIcon)`
    display: inline;
    width: 2.5rem;
    height: 2.5rem;
    color: ${props => props.theme.blue};
    margin-left: 0.5rem;
    margin-right: 0.5rem;
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
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
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
    borrow?: MyBorrow;
}

interface FormData {
    price: string;
}

export const RepayModal = ({ close, borrow }: SuppluModalProps) => {
    const { borrowLimitPercent, borrowBalance} = useBalance();
    const { register,  watch} = useForm<FormData>();
    const { formatToUsd, getPrice } = useTokens();

    const currentToken = borrow?.token || Token.TON;
    const {ticker} = TokenMap[currentToken];

    const { sendTransaction, isWaitingResponse } = useWallet();

    const tokenAmount = watch("price");
    const isMoreMax = Number(tokenAmount) > (borrow?.max || 0);
    const isMoreMin = Number(tokenAmount) < 1e-18;

    let limitUsedPercent = isMoreMax ?  borrowLimitPercent :
        getPrice(currentToken, tokenAmount) * borrowLimitPercent / borrowBalance;

    let borrowBalanceTotal = isMoreMax ? formatUsd(0) : 
        formatUsd(Math.abs(borrowBalance - getPrice(currentToken, tokenAmount)));

    const limitUsedTotal = formatPercent(borrowLimitPercent - limitUsedPercent);


    const click = async () => {
        try {
            await sendTransaction(tokenAmount, currentToken, Action.repay);
            
            notification.open({
                message: 'Repay is successful',
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


    return (
        <Dialog.Panel as={DialogStyled}>
            <CloseButton onClick={close} />
            <Title>Repay {ticker}</Title>
            <HelpWrapper>
                <Subtitle>Amount</Subtitle>
                <MyStyledInput type='number' step='any' min={1e-18} max={borrow?.max} maxLength={7}  {...register('price', { required: true, pattern: /^(0|[1-9]\d*)(\.\d+)?$/ })} placeholder="Enter amount" />
                {watch("price") && <AmountInDollars>{formatToUsd(currentToken, watch('price'))}</AmountInDollars>}
            </HelpWrapper>
            <HelpWrapper>
                <Subtitle>Transaction Overview</Subtitle>
                <InfoWrapper>
                    <InfoTextWrapper>
                        <InfoText>MAX</InfoText>
                        <InfoText>{formatSmallValue(borrow?.max || 0)} {ticker}</InfoText>
                    </InfoTextWrapper>
                    <InfoTextWrapper>
                        <InfoText>Borrow Limit Used</InfoText>
                        <InfoText> {formatPercent(borrowLimitPercent)}{<ArrowRight />}{ limitUsedTotal }</InfoText>
                    </InfoTextWrapper>
                    <InfoTextWrapper>
                        <InfoText>Borrow Balance</InfoText>
                        <InfoText>{formatUsd(borrowBalance)} {<ArrowRight />} {borrowBalanceTotal}</InfoText>
                    </InfoTextWrapper>
                </InfoWrapper>
            </HelpWrapper>
            <ModalBtn loading={isWaitingResponse} disabled={isMoreMax || !tokenAmount || isMoreMin} onClick={click}>Repay</ModalBtn>
        </Dialog.Panel>
    )
}
