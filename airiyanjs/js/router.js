import { createBrowserRouter } from "react-router-dom";
import { CommonLayout } from "./layout/commonPage";
import { authMiddleware } from "./common/middlewares/authendication";
import { mainLoader } from "./common/loaders/mainLoader";
import { ErrorPage } from "./layout/errorpage";
import { LOOM_ROUTES } from "./looms/router";
import { SALES_ROUTES } from "./routers/salesRoutes";
import { PURCHASE_ROUTES } from "./routers/purchaseRoutes";
import { MATERIAL_ROUTES } from "./routers/materialRoutes";
import { FUND_ROUTES } from "./routers/fundRoutes";
import { SETTING_ROUTES } from "./routers/settingRoutes";
import { LoginWithContext } from "./auth/login";


export async function pathLoader(params) {
    return { pathLoaderValue: "this is test value from pathLoader" };
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <CommonLayout />,
        middleware: [authMiddleware],
        loader: mainLoader,
        hydrateFallbackElement: <div>Loading Page…</div>,
        children: [
            {
                index: true,
                loader: pathLoader,
                handle: {},
                lazy: () => import("./home/home.js"),
            },
            {
                path: "notfound",
                element: <ErrorPage status={404} text="Page Not found" />
            },
            {
                path: "loom",
                handle: {
                    loggedUser: true,
                    category: ["loom"],
                },
                children: LOOM_ROUTES,
            },
            {
                path: "sales",
                handle: {
                    loggedUser: true,
                },
                children: SALES_ROUTES,
            },
            {
                path: "purchase",
                handle: {
                    loggedUser: true,
                },
                children: PURCHASE_ROUTES,
            },
            {
                path: "materials",
                handle: {
                    loggedUser: true,
                },
                children: MATERIAL_ROUTES,
            },
            {
                path: "fund",
                handle: {
                    loggedUser: true,
                },
                children: FUND_ROUTES,
            },
            {
                path: "settings",
                handle: {
                    loggedUser: true,
                },
                children: SETTING_ROUTES,
            },
            {
                path: "login",
                element: <LoginWithContext />
            }
        ],
        errorElement: <ErrorPage />
    }
]);
