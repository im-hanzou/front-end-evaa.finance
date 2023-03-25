import { beginCell, Contract, Address } from 'ton';

export class Minter implements Contract {
    constructor(readonly address: Address) { }
    async getWalletAddress(provider: any, address: Address) {
        const param = {
            type: 'slice',
            cell: beginCell().storeAddress(address).endCell()
        } as any;
        const { stack } = await provider.get("get_wallet_address", [param]);
        return stack.readAddress();
    }
    async getBalance(provider: any) {
        const { stack } = await provider.get("get_wallet_data", []);
        return stack;
    }
}