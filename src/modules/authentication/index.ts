import Login from "./components/Login";
import OktaIdpRedirect from "./components/OktaIdpRedirect";
import InvalidUserPage from "./components/oktaNonInviteUser";

import Routes from "./routes";

export default [
    {
        Component: Login,
        path: Routes.Login
    },
    {
        Component: OktaIdpRedirect,
        path: Routes.IdpSuccessOkta
    },
    {
        Component: InvalidUserPage,
        path: Routes.InvalidUserPage
    }
];
