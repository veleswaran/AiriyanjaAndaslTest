import { ACCESS_LIMITS } from "../enums/accessLimitEnum.js";

export const SETTING_ROUTES = [
    {
        path: "search/units",
        handle: {
            title: "Manage Product Unit",
            accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE],
        },
        lazy: () => import("../units/unitPage.js").then(mod => ({ Component: mod.UnitPage }))
    },
    {
        path: "search/payment-type",
        handle: {
            title: "Manage Payment Type",
            accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT],
        },
        lazy: () => import("../payments/method/PaymentTypePage.js").then(mod => ({ Component: mod.PaymentTypePage }))
    },
    {
        path: "search/purpose",
        handle: {
            title: "Manage payment purpose",
            accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT],
        },
        lazy: () => import("../remittance/purpose/purposePage.js").then(mod => ({ Component: mod.PurposePage }))
    },
    {
        path: "search/transporter",
        handle: {
            title: "Manage Transporters",
            accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT],
        },
        lazy: () => import("../clients/clientPage.js").then(mod => ({ Component: mod.transporterClientPage }))
    }

];