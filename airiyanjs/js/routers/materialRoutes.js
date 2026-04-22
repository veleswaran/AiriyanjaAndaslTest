import { ACCESS_LIMITS } from "../enums/accessLimitEnum.js";

export const MATERIAL_ROUTES = [
    {
        path: "search/products",
        handle: {
            title: "Manage Sales Clients",
            accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE],
        },
        lazy: () => import("../materials/products/productPage.js").then(mod => ({ Component: mod.ProductPageWithBD }))
    },
    {
        path: "search/consumables",
        handle: {
            title: "Manage Consumables",
            accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE],
        },
        lazy: () => import("../materials/consumables/search/searchConsumable.js").then(mod => ({ Component: mod.SearchConsumable }))
    },
    {
        path: "search/commodity",
        handle: {
            title: "Manage Commodity",
            accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE],
        },
        lazy: () => import("../materials/commodity/commodityPage.js").then(mod => ({ Component: mod.CommodityPage }))
    },
    {
        path: "search/specsgroup",
        handle: {
            title: "Manage Specs Group",
            accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE],
        },
        lazy: () => import("../materials/products/specsGroup/specsGroupNamePage.js").then(mod => ({ Component: mod.SpecsGroupNamePage }))
    },
    {
        path: "search/specsname",
        handle: {
            title: "Manage Specs Name",
            accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE],
        },
        lazy: () => import("../materials/products/specsName/specsNamePage.js").then(mod => ({ Component: mod.SpecsNamePage }))
    },
    {
        path: "search/identifiers",
        handle: {
            title: "Manage Identifiers",
            accessLimit: [ACCESS_LIMITS.MATERIAL_MANAGE],
        },
        lazy: () => import("../materials/identifier/identifierPage").then(mod => ({ Component: mod.IdentifierPage }))
    }
];