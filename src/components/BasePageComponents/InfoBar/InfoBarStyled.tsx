import styled from "styled-components";
import { BoldRobotoText, MediumRobotoText } from "../../Texts/MainTexts";

export const InfoBarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 90%;
    margin-top: 2.5rem;
    
    @media only screen and (max-width: 480px) {
        margin-top: 7rem;
        align-items: start;
        margin-left: 2rem;
        margin-right: 2rem;
        position: relative;
    }  
`

export const MoneyInfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    @media only screen and (max-width: 480px) {
        min-height: 17rem;
        flex-direction: column;
        justify-content: start;
        padding-left: 19rem;
        gap: 3rem;
    }  
`

export const MoneyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ${MediumRobotoText} {
        color: ${props => props.theme.blue};
        font-size: 1.6rem;
    }

    ${BoldRobotoText} {
        color: ${props => props.theme.gray};
        font-size: 2.4rem;
    }
    
    @media only screen and (max-width: 480px) {
        align-items: start;
    } 
`
export const WhiteSpan = styled.span`
    color: ${props => props.theme.white};
    font-size: 2.4rem;
`
export const WhiteSpanTwo = styled.span`
    color: ${props => props.theme.white};
    font-size: 1.6rem;
    margin-left: 1rem;
`

export const APYWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 15.5rem;
    height: 15.5rem;
    border: 4px solid ${props => props.theme.blue};
    border-radius: 1000px;
    margin: 0 13.7rem;
    
    @media only screen and (max-width: 480px) {
        margin: 0;
        position: absolute;
        left: 0;
    }  
`

export const APYWrapperTitle = styled(BoldRobotoText)`
    font-size: 2rem;
    color: ${props => props.theme.gray};
`
export const APYWrapperSubtitle = styled(BoldRobotoText)`
    font-size: 2rem;
    color: ${props => props.theme.white};
`


export const BorrowLineWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
`
export const BorrowLineSubtitle = styled(MediumRobotoText)`
    font-size: 1.6rem;
    color: ${props => props.theme.gray};
    white-space: nowrap
`
export const BorrowLineBack = styled.div`
    position: absolute;
    width: 100%;
    height: 0.4rem;
    background-color: #1F2428;
`
export const BorrowLineFront = styled.div<{ borrowLimit: number }>`
    position: absolute;
    width: ${props => props.borrowLimit}%;
    height: 0.4rem;
    background-color: ${props => props.theme.blue};
`

export const BorrowLine = styled.div`
    position: relative;
    width: 100%;
    height: 0.4rem;
    margin: 5rem 2rem;
`

