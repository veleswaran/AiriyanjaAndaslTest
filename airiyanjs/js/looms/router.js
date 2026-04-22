
export const LOOM_ROUTES = [
    {
        index: true,
        handle: { requiredRole: "abc" },
        element: <div>Hai</div>,
    },
    {
        path: "beamgroup",
        handle: {
            title: "Beam Group",
        },
        lazy: () => import("./beamgroups/searchBeamGroup.js").then(mod => ({ Component: mod.SearchBeamGroup }))
    },
    {
        path: "weft",
        handle: {
            title: "Manage weft",
        },
        lazy: () => import("./weft/weftPage.js").then(mod => ({ Component: mod.WeftPage }))
    },
    {
        path: "beam",
        handle: {
            title: "Manage Beams",
        },
        lazy: () => import("./beams/searchBeams.js").then(mod => ({ Component: mod.SearchBeams }))
    },
    {
        path: "styles",
        handle: {
            title: "Manage Style",
        },
        lazy: () => import("./consumptions/consumptionPage.js").then(mod => ({ Component: mod.ConsumptionPage })),
    },
    {
        path: "add_dc",
        handle: {
            title: "Add Delivery challen",
        },
        lazy: () => import("./dc/addDc.js").then(mod => ({ Component: mod.AddDc }))
    },
    {
        path: "search_dc",
        handle: {
            title: "Search Delivery challen",
        },
        lazy: () => import("./dc/search/searchDc.js").then(mod => ({ Component: mod.SearchDC }))
    },
    {
        path: "add_rc",
        handle: {
            title: "Add Return challen",
        },
        lazy: () => import("./challan/addRc.js").then(mod => ({ Component: mod.AddRc }))
    },
    {
        path: "search_rc",
        handle: {
            title: "Search Return challen",
        },
        lazy: () => import("./dc/search/searchDc.js").then(mod => ({ Component: mod.SearchRC }))
    },
    {
        path: "searchloom",
        handle: {
            title: "Search client loom",
        },
        lazy: () => import("./clientLoom/clientLoomPage.js").then(mod => ({ Component: mod.ClientLoomPage }))
    },
    {
        path: "clientbw",
        handle: {
            title: "check client beam and weft",
        },
        lazy: () => import("./combined/clientBeamWeftpage.js").then(mod => ({ Component: mod.ClientBeamWeftPage }))
    },
    {
        path: "printdc",
        handle: {
            title: "Print Dc"
        },
        lazy: () => import("./dc/printDc.js").then(mod => ({ Component: mod.PrintDc }))
    },
    {
        path: "printqr",
        handle: {
            title: "Print Qrcode"
        },
        lazy: () => import("./images/printQR.js").then(mod => ({ Component: mod.PrintQR }))
    },
    {
        path: "printclothchallan",
        handle: {
            title: "Print Cloth Challan"
        },
        lazy: () => import("./loomedCloth/challan/clothChallanPrint.js").then(mod => ({ Component: mod.PrintClothChallan }))
    },
    {
        path: "search/loomed-cloths",
        handle: {
            title: "Search Loomed Cloth",
        },
        lazy: () => import("./loomedCloth/LoomedClothPage.js").then(mod => ({ Component: mod.LoomedClothPage }))
    },    
    {
        path: "search/empty-beams",
        handle: {
            title: "Search Empty Beams",
        },
        lazy: () => import("./emptyBeams/EmptyBeamsSearch.js").then(mod => ({ Component: mod.EmptyBeamsSearch }))
    }
];