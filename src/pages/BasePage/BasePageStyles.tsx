import styled from "styled-components";
import { BoldRobotoText, MediumRobotoText } from "../../components/Texts/MainTexts";

export const BasePageContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    /* background-color: ${props => props.theme.light}; */
    background: linear-gradient(
    to bottom,
    #080A0E 0%,
    #080A0E 55rem,
    #F9FAFB 55rem,
    #F9FAFB 100%
  );
`

export const BasePageBackgroundOne = styled.div`
    position: absolute;
    top: 0;
    width: 100vw;
    background-color: #080A0E;
    height: 44.2rem;
    /* z-index: 100; */
`

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 90%;
`

export const TestnetInfo = styled(BoldRobotoText)`
    display: inline;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 37rem;
    font-size: 1.5rem;

    
    @media only screen and (max-width: 480px) {
        top: 8rem;
        left: 2rem;
        right: 1rem;
        transform: none;
    }  
`

export const TestnetMinor = styled(MediumRobotoText)`
    display: inline;
    color: #657786;
    font-size: 1.6rem;
`

export const MobileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: #000;
`

export const MobileInfo = styled(BoldRobotoText)`
    height: 100%;
    color: #fff;
    font-size: 2.6rem;
    margin: 3rem;
    margin-top: 15rem;
`

export const TestnetHeader = styled.div`
    font-family: 'Roboto';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 42px;
    left: 0px;
    top: 0px;
    background-color: #0381C5;
`
export const TestnetHeaderInfo = styled.div`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 16.1115px;
    line-height: 24px;
    color: white;
`
export const TestnetHeaderGuide = styled.button`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    margin-left: 20px;

    text-decoration-line: underline;
    text-transform: uppercase;
    color: #FFFFFF;

`