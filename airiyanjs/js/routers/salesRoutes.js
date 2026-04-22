import { ACCESS_LIMITS } from "../enums/accessLimitEnum.js";
import { ErrorPage } from "../layout/errorpage.js";

export const SALES_ROUTES = [
    {
        path: "search/clientactivity",
        handle: {
            title: "Search sales Client transactions",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../clients/activity/activitySearch.js").then(mod => ({ Component: mod.salesClientActivity }))
    },
    {
        path: "search/clients",
        handle: {
            title: "Manage Sales Clients",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../clients/clientPage.js").then(mod => ({ Component: mod.salesClientPage }))
    },
    {
        path: "create-bill",
        handle: {
            title: "Create Sales Bill",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/createBill.js").then(mod => ({ Component: mod.CreateSalesBill }))
    },
    {
        path: "create-dc",
        handle: {
            title: "Create Delivery Challan",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/createBill.js").then(mod => ({ Component: mod.CreateSalesDc }))
    },
    {
        path: "create-credit-note",
        handle: {
            title: "Create Credit Note",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/createBill.js").then(mod => ({ Component: mod.createCreditNote }))
    },,
    {
        path: "create-job-work",
        handle: {
            title: "Create Job Work",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/createBill.js").then(mod => ({ Component: mod.CreateJobWork }))
    },
    {
        path: "search/bills",
        handle: {
            title: "Search Bills",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/search/billSearch.js").then(mod => ({ Component: mod.SalesBillSearch }))
    },
    {
        path: "search/dcs",
        handle: {
            title: "Search DC",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/search/billSearch.js").then(mod => ({ Component: mod.SalesDcSearch }))
    },
    {
        path: "search/credit-notes",
        handle: {
            title: "Search Credit Notes",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/search/billSearch.js").then(mod => ({ Component: mod.SalesCreditNoteSearch }))
    },
    {
        path: "search/job-work",
        handle: {
            title: "Search Job Work",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/search/billSearch.js").then(mod => ({ Component: mod.SalesJobWorkSearch }))
    },
    {
        path: "search/outstanding",
        handle: {
            title: "Sales Outsanding",
            accessLimit: [ACCESS_LIMITS.SALES_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT_VIEW],
        },
        lazy: () => import("../clients/outstanding/outstandingBill").then(mod => ({ Component: mod.salesOutstanding }))
    },
    {
        path: "search/payments",
        handle: {
            title: "Search Sales Payment",
            accessLimit: [ACCESS_LIMITS.SALES_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT_VIEW],
        },
        lazy: () => import("../payments/paymentSearch.js").then(mod => ({ Component: mod.salesPaymentSearch }))
    },
    {
        path: "paymentadd",
        handle: {
            title: "Add Sales Payment",
            accessLimit: [ACCESS_LIMITS.SALES_PAYMENT],
        },
        lazy: () => import("../payments/addPayment.js").then(mod => ({ Component: mod.salesAddPayment }))
    },
    {
        path: "viewbill",
        handle: {
            title: "View Sales Bill",
            accessLimit: [ACCESS_LIMITS.SALES_BILL, ACCESS_LIMITS.PURCHASE_BILL],
        },
        lazy: () => import("../billings/viewer/viewBill.js"),
    },
    {
        path: "printallbill",
        handle: {
            title: "Print current FY Sales Bill",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/viewer/printAllBill.js").then(mod => ({ Component: mod.PrintAllBill })),
    },
    {
        path: "printallFYDC",
        handle: {
            title: "Print current FY DC",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/viewer/printAllBill.js").then(mod => ({ Component: mod.PrintFyDc })),
    },
    {
        path: "printallFYCT",
        handle: {
            title: "Print current FY Credit Note",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/viewer/printAllBill.js").then(mod => ({ Component: mod.PrintFyCT })),
    },
    {
        path: "printallFYJW",
        handle: {
            title: "Print current FY Job Work",
            accessLimit: [ACCESS_LIMITS.SALES_BILL],
        },
        lazy: () => import("../billings/viewer/printAllBill.js").then(mod => ({ Component: mod.PrintFyJW })),
    },
    {
        path: "*",
        handle: {
            title: "404 Page not Found",
        },
        element: <ErrorPage status={404} text="Page Not found" />
    }
];