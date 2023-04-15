import BasePage from "./pages/BasePage/BasePage";
import FaucetPage from "./pages/FaucetPage/FaucetPage";

interface IRoute {
    path: string;
    name: string;
    auth: boolean;
    component: any;
    props?: any;
}

const mainRoutes: IRoute[] = [
    {
        name: 'Base',
        path: '/',
        component: BasePage,
        auth: false
    },
    {
        name: 'Faucet',
        path: '/faucet',
        component: FaucetPage,
        auth: false
    },
];

const routes: IRoute[] = [...mainRoutes];

export default routes;
