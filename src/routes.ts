import BasePage from "./pages/BasePage/BasePage";

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
];

const routes: IRoute[] = [...mainRoutes];

export default routes;
