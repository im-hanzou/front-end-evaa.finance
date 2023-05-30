
import { Dialog } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import LoadingComponent from '../LodingComponent/LoadingComponent';
import { QRModal } from '../Modals/Modal';
import { BlueButton, WalletNumWithMenu } from './AuthButtonStyles';

import { useWallet } from '../../store/wallet';

export function AuthButton() {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

	const { login, logout, userAddress, isLoading } = useWallet();

	if (isLoading) {
		return <LoadingComponent />;
	}

	return (
		<>
			{userAddress &&
				<WalletNumWithMenu address={userAddress} onDisconnect={() => { logout(); navigate(0); }} />
			}

			{!userAddress &&
				<BlueButton onClick={login}>{t("basePage.addWallet")}</BlueButton>
			}
		</>
	);
}


