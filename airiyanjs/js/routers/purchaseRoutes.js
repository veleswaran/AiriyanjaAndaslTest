import { ACCESS_LIMITS } from "../enums/accessLimitEnum.js";
import { ErrorPage } from "../layout/errorpage.js";

export const PURCHASE_ROUTES = [
    {
        path: "search/clientactivity",
        handle: {
            title: "Search purchase Client transactions",
            accessLimit: [ACCESS_LIMITS.PURCHASE_BILL],
        },
        lazy: () => import("../clients/activity/activitySearch.js").then(mod => ({ Component: mod.purchaseClientActivity }))
    },
    {
        path: "search/clients",
        handle: {
            title: "Manage Purchase Clients",
            accessLimit: [ACCESS_LIMITS.PURCHASE_BILL],
        },
        lazy: () => import("../clients/clientPage.js").then(mod => ({ Component: mod.purchaseClientPage }))
    },
    {
        path: "create-bill",
        handle: {
            title: "Create Purchase Bill",
            accessLimit: [ACCESS_LIMITS.PURCHASE_BILL],
        },
        lazy: () => import("../billings/createBill.js").then(mod => ({ Component: mod.createPurchaseBill }))
    },
    {
        path: "create-debit-note",
        handle: {
            title: "Create Debit Note",
            accessLimit: [ACCESS_LIMITS.PURCHASE_BILL],
        },
        lazy: () => import("../billings/createBill.js").then(mod => ({ Component: mod.createDebitNote }))
    },
    {
        path: "search/bills",
        handle: {
            title: "Search Bills",
            accessLimit: [ACCESS_LIMITS.PURCHASE_BILL],
        },
        lazy: () => import("../billings/search/billSearch.js").then(mod => ({ Component: mod.purchaseBillSearch }))
    },
   {
        path: "search/debit-notes",
        handle: {
            title: "Search Debit Notes",
            accessLimit: [ACCESS_LIMITS.PURCHASE_BILL],
        },
        lazy: () => import("../billings/search/billSearch.js").then(mod => ({ Component: mod.purchaseDebitNoteSearch }))
    },
    {
        path: "search/outstandings",
        handle: {
            title: "Purchanse Outsanding",
            accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.PURCHASE_PAYMENT_VIEW],
        },
        lazy: () => import("../clients/outstanding/outstandingBill.js").then(mod => ({ Component: mod.purchaseOutstanding }))
    },
    {
        path: "search/payments",
        handle: {
            title: "Search Purchase Payment",
            accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.PURCHASE_PAYMENT_VIEW],
        },
        lazy: () => import("../payments/paymentSearch.js").then(mod => ({ Component: mod.purchasePaymentSearch }))
    },
    {
        path: "paymentadd",
        handle: {
            title: "Add Purchase Payment",
            accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT],
        },
        lazy: () => import("../payments/addPayment.js").then(mod => ({ Component: mod.purchaseAddPayment }))
    },
    {
        path: "printPayment",
        handle: {
            title: "Print Payment",
            accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.PURCHASE_PAYMENT_VIEW],
        },
        lazy: () => import("../payments/printPayment.js").then(mod => ({ Component: mod.PrintPayment }))
    },
    {
        path: "*",
        handle: {
            title: "404 Page not Found",
        },
        element: <ErrorPage status={404} text="Page Not found" />
    }
];