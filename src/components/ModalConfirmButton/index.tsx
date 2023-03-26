import styled from "styled-components";

import { Button } from 'antd'; 

interface ModalConfirmButtonProps {
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    children: JSX.Element | any;
};

export const StyledButton = styled(Button)`
    line-height: 1.8rem;
    background-color: #0381C5;

    & span {
        font-size: 1.8rem;
    }

    &.ant-btn-loading {
        pointer-events: none;
    }
    
    & svg {
        font-size: 2rem;
    }

    &:disabled {
        background-color: #767B7D4D;
        color: #fff;
    }
`

export default function ModalConfirmButton({ children, loading, ...rest }: ModalConfirmButtonProps) {
    
    return (
        <StyledButton
            {...rest}
            loading={loading}
            type='primary'
        >
            {loading && 'Confirm the action in the wallet'}
            {!loading && children}
        </StyledButton>
    )
}