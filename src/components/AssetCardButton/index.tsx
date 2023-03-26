import styled from "styled-components";

export const AssetCardButton = styled.button<{ left?: number, right?: number,  first?: boolean }>`
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    right: 0;
    /* right: ${props => props.right && props.right}rem; */
    /* left : ${props => !props.right && 0}rem; */
    color: ${props => props.theme.white};
    background-color: #0381C5;
    border: none;
    border-radius: 5.3px;
    padding: 0.7rem 1.9rem;
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;

    &:disabled{
        background-color: #767B7D4D;
    }
`