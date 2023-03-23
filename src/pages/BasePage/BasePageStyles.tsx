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
    to top,
    #F9FAFB 0%,
    #F9FAFB 52%,
    #080A0E 52%,
    #080A0E 100%
  );
    /* z-index: 100; */
    @media only screen and (min-width: 480px) {
        /* width: 100%; */
    }  
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