import { useBalance } from '@/store/balance';
import { formatPercent, formatUsd } from '@/utils';

import { BoldRobotoText, MediumRobotoText } from '../../Texts/MainTexts';
import { APYWrapper, APYWrapperSubtitle, APYWrapperTitle, BorrowLine, BorrowLineBack, BorrowLineFront, BorrowLineSubtitle, BorrowLineWrapper, InfoBarWrapper, MoneyInfoWrapper, MoneyWrapper, WhiteSpan, WhiteSpanTwo } from './InfoBarStyled';

export interface InfoBarProps { }


const InfoBar = ({} : InfoBarProps) => { 
    const { borrowBalance, supplyBalance, borrowLimitPercent, borrowLimitValue } = useBalance();
    const [borrowBalanceInt, borrowBalanceFraction] = formatUsd(borrowBalance).split(".");
    const [supplyBalanceInt, supplyBalanceFraction] = formatUsd(supplyBalance).split(".");
    
    return (
        <InfoBarWrapper>
            <MoneyInfoWrapper>
                <MoneyWrapper>
                    <MediumRobotoText>Supply Balance</MediumRobotoText>
                    <BoldRobotoText><WhiteSpan>{supplyBalanceInt}</WhiteSpan>.{supplyBalanceFraction}</BoldRobotoText>
                </MoneyWrapper>
                <APYWrapper>
                    <APYWrapperTitle>NET APY</APYWrapperTitle>
                    <APYWrapperSubtitle>...</APYWrapperSubtitle>
                </APYWrapper>
                <MoneyWrapper>
                    <MediumRobotoText>Borrow Balance</MediumRobotoText>
                    <BoldRobotoText><WhiteSpan>{borrowBalanceInt}</WhiteSpan>.{borrowBalanceFraction}</BoldRobotoText>
                </MoneyWrapper>
            </MoneyInfoWrapper>
            <BorrowLineWrapper>
                <BorrowLineSubtitle>Limit <WhiteSpanTwo>{formatPercent(borrowLimitPercent)}</WhiteSpanTwo></BorrowLineSubtitle>
                <BorrowLine>
                    <BorrowLineBack/>
                    <BorrowLineFront borrowLimit={borrowLimitPercent * 100}/>
                </BorrowLine>
                <BorrowLineSubtitle>{formatUsd(borrowLimitValue.toString())}</BorrowLineSubtitle>
            </BorrowLineWrapper>
        </InfoBarWrapper>
    )
}

export default InfoBar;