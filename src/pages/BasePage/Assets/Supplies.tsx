import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { notification } from 'antd';
import { Address } from "ton"

import { useBalance, MySupply, Supply } from '@/store/balance';
import { useWallet } from '@/store/wallet';

import { AssetCardSkeleton, MySuppliesAssetCard, SupplyAssetCard } from '../../../components/BasePageComponents/AssetCard/AssetCard';
import styled from 'styled-components';
import { MySuppliesDescriptionBar, SupplyDescriptionBar } from '../../../components/BasePageComponents/AssetsDescriptionBar/AssetsDescriptionBar';
import { SupplyModal } from '../../../components/Modals/SupplyModal';
import { AssetsSubWrapper, AssetsSubtitle, AssetsTitle, AssetsWrapper } from './AssetsStyles';
import { WithdrawModal } from '../../../components/Modals/WIthdrawModal';


export interface SuppliesProps {
    tab: string;
}

const TokensFaucet = styled.div`
    font-size: 2.2rem;
    margin-bottom: 3rem;
    font-style: normal;
    font-weight: 400;
    height: 2rem;
    font-size: 1.5rem;
    color: black;
    text-transform: uppercase;
    margin: 8px -12px -8px 12px;
    cursor: pointer;
    border-bottom: 2px solid #0381C5;
    font-style: normal;
    font-weight: 400;
    font-size: 13.0907px;
    line-height: 15px;
    @media only screen and (min-width: 480px){
    display: none;
    }
`


const Supplies = ({ tab }: SuppliesProps) => {
    const [api, contextHolder] = notification.useNotification();
    const { wallet, callIfLoged: callIfLogin } = useWallet();
    const { mySupplies, supplies, isReady } = useBalance();
    const [selectedMySupply, setSelectedMySupply] = useState<MySupply | undefined>();
    const [selectedSupply, setSelectedSupply] = useState<Supply | undefined>();
    const currentMySupplies = tab === '1' ? mySupplies : [];
    const currentSupplies = tab === '1' ? supplies : [];

    return (
        <>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={!!selectedMySupply} onClose={() => setSelectedMySupply(undefined)}>
                <WithdrawModal supply={selectedMySupply} close={() => setSelectedMySupply(undefined)} />
            </Dialog>
            <Dialog className={`w-full h-full fixed bg-black bg-opacity-50 top-0 flex justify-center items-center`} open={!!selectedSupply} onClose={() => setSelectedSupply(undefined)}>
                <SupplyModal supply={selectedSupply} close={() => setSelectedSupply(undefined)} />
            </Dialog>
            <AssetsWrapper>

                <AssetsSubWrapper>
                    <AssetsTitle>Your Supplies

                    </AssetsTitle>
                    {(!isReady || currentMySupplies.length > 0) &&
                        <MySuppliesDescriptionBar />
                    }
                    {isReady && !currentMySupplies.length &&
                        <AssetsSubtitle>Nothing supplied yet</AssetsSubtitle>
                    }
                    {currentMySupplies.map(mySupply => (
                        <MySuppliesAssetCard {...mySupply} key={mySupply.id} onClick={callIfLogin(() => setSelectedMySupply(mySupply))} />
                    ))}
                    {!isReady &&
                        <AssetCardSkeleton />
                    }

                </AssetsSubWrapper>
                <AssetsSubWrapper>
                    <AssetsTitle>Supply


                    </AssetsTitle>
                    {currentSupplies.length > 0 &&
                        <SupplyDescriptionBar />
                    }
                    {!currentSupplies.length &&
                        <AssetsSubtitle>No supplies yet</AssetsSubtitle>
                    }
                    {currentSupplies.map(supply => (
                        <SupplyAssetCard {...supply} key={supply.id} onClick={callIfLogin(() => setSelectedSupply(supply))} />
                    ))}
                </AssetsSubWrapper>
            </AssetsWrapper>
        </>

    )
}

export default Supplies;
