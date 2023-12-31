import { Dialog } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import styled from "styled-components";

import { BoldRobotoText, RegularRobotoText } from "../Texts/MainTexts";

interface QRModalProps {
	close: () => void;
    link: string;
}

const GrayBtn = styled.button`
    background: #F2F2F2;
    border: 1px solid #F2F2F2;
    border-radius: 10px;
    font-size: 2rem;
    font-weight: 700;
    padding: 1rem 2rem;
`

const DialogStyled = styled(Dialog.Panel)`
    padding: 4rem 5rem;
	background: #fff;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 45rem;
`

const Title = styled(BoldRobotoText)`
    color: #000;
    text-align: center;
    margin-top: 3rem;
    margin-bottom: 0.5rem;
    font-size: 2.4rem;
`

const Description = styled(RegularRobotoText)`
    color: #000;
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2rem;
`

export const QRModal = ({close, link}: QRModalProps) => {
    const { t, i18n } = useTranslation(); 
	return (
		<Dialog.Panel as={DialogStyled}>
            <QRCode
                size={256}
                style={{ height: '26rem', maxWidth: '100%', width: '100%' }}
                value={link}
                viewBox={`0 0 256 256`}
            />
            <Title>{t("qrModal.title")}</Title>
            <Description>{t("qrModal.description")}</Description>
            <GrayBtn onClick={close}>{t("qrModal.cancel")}</GrayBtn>
		</Dialog.Panel>
	)
}
