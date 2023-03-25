import { Address, beginCell, Cell, contractAddress } from 'ton';

import { MASTER_EVAA_ADDRESS } from '@/config';

import userSCData from './userSmartContractData.json';

export function getUserContractAddress(userAddress?: Address) {
    const oracleMasterSourceV1CodeCell = Cell.fromBoc(Buffer.from(userSCData.hex, 'hex'))[0];

    return contractAddress(0, {
        code: oracleMasterSourceV1CodeCell,
        data: beginCell()
            .storeAddress(MASTER_EVAA_ADDRESS)
            .storeAddress(userAddress) // u need to put user wallet address here to calculate userContractAddress
            .storeDict()
            .storeInt(BigInt(0), 1)
            .endCell(),
    });
}