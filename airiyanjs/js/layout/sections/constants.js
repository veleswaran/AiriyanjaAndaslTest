import { ACCESS_LIMITS } from "../../enums/accessLimitEnum";

export const MENUS = [
    {
        name: "Home",
        url: "/",
        css: "nav-link text-secondary"
    },
    {
        name: "Sales",
        url: "#",
        childrens: [
            { accessLimit: [ACCESS_LIMITS.SALES_BILL], name: "Clients", url: "/sales/search/clients" },
            {
                accessLimit: [ACCESS_LIMITS.SALES_BILL], name: "Bill",
                url: "#",
                childrens: [
                    { name: "Create", url: "/sales/create-bill" },
                    { name: "Search", url: "/sales/search/bills" }
                ]
            },
            {
                accessLimit: [ACCESS_LIMITS.SALES_BILL], name: "DC",
                url: "#",
                childrens: [
                    { name: "Create", url: "/sales/create-dc" },
                    { name: "Search", url: "/sales/search/dcs" }
                ]
            },
            {
                accessLimit: [ACCESS_LIMITS.SALES_BILL], name: "Job Work",
                url: "#",
                childrens: [
                    { name: "Create", url: "/sales/create-job-work" },
                    { name: "Search", url: "/sales/search/job-work" }
                ]
            },
            {
                accessLimit: [ACCESS_LIMITS.SALES_BILL], name: "Credit Notes",
                url: "#",
                childrens: [
                    { name: "Create", url: "/sales/create-credit-note" },
                    { name: "Search", url: "/sales/search/credit-notes" }
                ]
            },
            { accessLimit: [ACCESS_LIMITS.SALES_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT_VIEW], name: "Payments", type: "heading" },
            { accessLimit: [ACCESS_LIMITS.SALES_PAYMENT], name: "Add Payment", url: "/sales/paymentadd" },
            { accessLimit: [ACCESS_LIMITS.SALES_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT_VIEW], name: "Search Payments", url: "/sales/search/payments" },
            { accessLimit: [ACCESS_LIMITS.SALES_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT_VIEW], name: "View Outstanding", url: "/sales/search/outstanding" },
            { accessLimit: [ACCESS_LIMITS.SALES_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT_VIEW], name: "Search Transaction", url: "/sales/search/clientactivity" }
        ]
    },
    {
        name: "Purchase",
        url: "#",
        childrens: [
            { accessLimit: [ACCESS_LIMITS.PURCHASE_BILL], name: "Clients", url: "/purchase/search/clients" },
            {
                accessLimit: [ACCESS_LIMITS.PURCHASE_BILL], name: "Billings",
                url: "#",
                childrens: [
                    { name: "Create Bill", url: "/purchase/create-bill" },
                    { name: "Search Bills", url: "/purchase/search/bills" }
                ]
            },
            {
                accessLimit: [ACCESS_LIMITS.PURCHASE_BILL], name: "Bobin Billings",
                category: ["loom"],
                url: "#",
                childrens: [
                    { name: "Create Bill", url: "/purchase/create-bill" },
                    { name: "Search Bills", url: "/purchase/search/bills" }
                ]
            },
            {
                accessLimit: [ACCESS_LIMITS.PURCHASE_BILL], name: "Weft Billings",
                category: ["loom"],
                url: "#",
                childrens: [
                    { name: "Create Bill", url: "/purchase/create-bill" },
                    { name: "Search Bills", url: "/purchase/search/bills" }
                ]
            },
            {
                accessLimit: [ACCESS_LIMITS.PURCHASE_BILL], name: "Debit Notes",
                url: "#",
                childrens: [
                    { name: "Create Debit Note", url: "/purchase/create-debit-note" },
                    { name: "Search Debit Notes", url: "/purchase/search/debit-notes" }
                ]
            },
            { accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.PURCHASE_PAYMENT_VIEW], name: "Payments", type: "heading" },
            { accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT], name: "Add Payment", url: "/purchase/paymentadd" },
            { accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.PURCHASE_PAYMENT_VIEW], name: "Search Payments", url: "/purchase/search/payments" },
            { accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.PURCHASE_PAYMENT_VIEW], name: "View Outstanding", url: "/purchase/search/outstandings" },
            { accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.PURCHASE_PAYMENT_VIEW], name: "Search Transaction", url: "/purchase/search/clientactivity" }
        ]
    },
    {
        name: "Materials",
        url: "#",
        accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE],
        childrens: [
            { name: "Products", url: "/materials/search/products" },
            { name: "Consumables", url: "/materials/search/consumables" },
            { name: "Setting", type: "heading" },
            { name: "Commodities", url: "/materials/search/commodity" },
            { name: "Identifiers", url: "/materials/search/identifiers" },
            { name: "Specs Group", url: "/materials/search/specsgroup" },
            { name: "Specs Name", url: "/materials/search/specsname" }
        ]
    },
    {
        name: "Settings",
        url: "#",
        childrens: [
            { name: "Payment", type: "heading" },
            { accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT], name: "Payment Purpose", url: "/settings/search/purpose" },
            { accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT], name: "Payment Method", url: "/settings/search/payment-type" },
            { accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE], name: "Units Setting", url: "/settings/search/units" },
            { name: "", type: "heading" },
            { accessLimit: [ACCESS_LIMITS.PURCHASE_PAYMENT, ACCESS_LIMITS.SALES_PAYMENT], name: "Transporters", url: "/settings/search/transporter" },
        ]
    },
    {
        name: "Funds",
        url: "#",
        accessLimit: [ACCESS_LIMITS.FUND],
        childrens: [
            { name: "#fund", type: "custom" },
            { name: "Search Statement", url: "/fund/search" },
            { name: "", type: "heading" },
            { name: "Add Fund", url: "/fund/add" },
            { name: "Withdraw Fund", url: "/fund/withdraw" },
        ]
    },
    {
        name: "Loom",
        url: "#",
        category: ["loom"],
        childrens: [
            { name: "Setting", type: "heading" },
            { name: "Beam Group", url: "/loom/beamgroup" },
            { name: "Wefts", url: "/loom/weft" },
            { name: "Beams", url: "/loom/beam" },
            { name: "Styles", url: "/loom/styles" },
            { name: "Challan", type: "heading" },
            { name: "Add DC", url: "/loom/add_dc" },
            { name: "Search DC", url: "/loom/search_dc" },
            { name: "Add RC", url: "/loom/add_rc" },
            { name: "Search RC", url: "/loom/search_rc" },
            { name: "Clients", type: "heading" },
            { name: "Client Looms", url: "/loom/searchloom" },
            { name: "Client Beams and Weft", url: "/loom/clientbw" },
            { name: "Empty Beams", url: "/loom/search/empty-beams" },
            { name: "Loomed Cloth", url: "/loom/search/loomed-cloths" }

        ]
    }
];