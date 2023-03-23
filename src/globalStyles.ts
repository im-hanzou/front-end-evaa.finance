import { createGlobalStyle } from 'styled-components';

import RobotoRegular from './assets/fonts/Roboto/Roboto-Regular.ttf'
import RobotoMedium from './assets/fonts/Roboto/Roboto-Medium.ttf'
// import RobotoSemiBold from './assets/fonts/Roboto/Roboto-SemiBold.ttf'
import RobotoBold from './assets/fonts/Roboto/Roboto-Bold.ttf'

export default createGlobalStyle`
    @font-face {
        font-family: "Roboto", sans-serif;
        src: local('Roboto'), local('Roboto'), 
            url(${RobotoRegular}) format('ttf');
        font-weight: 400;
        font-style: normal;
    }

    @font-face {
        font-family: "Roboto", sans-serif;
        src: local('Roboto'), local('Roboto'), 
            url(${RobotoMedium}) format('ttf');
        font-weight: 500;
        font-style: normal;
    }

    @font-face {
        font-family: "Roboto", sans-serif;
        src: local('Roboto'), local('Roboto'), 
            url(${RobotoBold}) format('ttf');
        font-weight: 700;
        font-style: normal;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;

        font-family: "Roboto", sans-serif;
        font-size: 10px;

        @media only screen and (max-width: 1720px) {  
            font-size: calc((100vw / 1720) * 10);
        } 

        @media only screen and (max-width: 480px) {  
            font-size: calc(100vw / 400 * 10);
        }
    }

    /* input number */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    input[type=number] {
        -moz-appearance:textfield; /* Firefox */
    }

    input[type=number]:invalid {
        border-color: red;
    }
`;