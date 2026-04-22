import { ACCESS_LIMITS } from "../enums/accessLimitEnum.js";

export const FUND_ROUTES = [
    {
        path: "search",
        handle: {
            title: "Manage Funds",
            accessLimit: [ACCESS_LIMITS.FUND],
        },
        lazy: () => import("../materials/fund/fundSearch.js").then(mod => ({ Component: mod.FundSearch }))
    },
    {
        path: "add",
        handle: {
            title: "Add Funds",
            accessLimit: [ACCESS_LIMITS.FUND],
        },
        lazy: () => import("../materials/fund/fundAdd.js").then(mod => ({ Component: mod.FundAdd }))
    },
    {
        path: "withdraw",
        handle: {
            title: "withdraw Funds",
            accessLimit: [ACCESS_LIMITS.FUND],
        },
        lazy: () => import("../materials/fund/fundWithdraw.js").then(mod => ({ Component: mod.FundWithdraw }))
    },
];