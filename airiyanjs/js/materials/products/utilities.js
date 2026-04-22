
export function getProductColKeys(products, showAll = true) {
    const identifierKeys = []
    const specVal = [];
    const specZero = [];
    const found = new Map();
    let taxNeeded = false;
    const allPackageUnits = new Set();
    let packageName = "";
    for (const product of products) {
        const { productIdentifiers = [], productSpecs = [], productTax = [], packageUnitId, packageUnit = {} } = product;
        productIdentifiers.forEach(iden => {
            const { identifier: { name } } = iden;
            if (!identifierKeys.includes(name)) {
                identifierKeys.push(name);
            }
        });
        productSpecs.forEach(psp => {
            const { specs: { specGroup: { name, orderOfDisplay, viewAsColumn, isVisible } = {} } = {} } = psp;
            if (viewAsColumn && (isVisible || showAll)) {
                if (!found.has(name)) {
                    found.set(name, true);
                    if (orderOfDisplay > 0) {
                        specVal.push({ name, orderOfDisplay })
                    } else {
                        specZero.push({ name })
                    }
                }
            }
        });
        if (productTax.length > 0) {
            let totalEnabled = 0;
            productTax.forEach(pt => {
                const { enabled = false } = pt;
                if (enabled) {
                    totalEnabled++;
                }
            })
            taxNeeded = totalEnabled > 0 ? true : taxNeeded;
        }
        // package section
        if (packageUnitId) {
            allPackageUnits.add(packageUnitId);
            const { name } = packageUnit;
            packageName = name;
        }
    }
    identifierKeys.sort((a, b) => a.localeCompare(b));
    specVal.sort((a, b) => a.orderOfDisplay - b.orderOfDisplay);
    specZero.sort((a, b) => a.name.localeCompare(b.name));
    const specsKeys = specVal.map(obj => obj.name);
    const zeroKeys = specZero.map(obj => obj.name);
    specsKeys.push(...zeroKeys);
    // Packaging colums deciding
    const packagingColumn = { needed: allPackageUnits.size > 0, isCommon: allPackageUnits.size === 1, commonName: packageName };
    return { specsKeys, identifierKeys, taxNeeded, packagingColumn };
}

export function getPackageColumnFromItem(items) {
    let packageName = "";
    const allPackageUnits = new Set();
    for (const item of items) {
        const { product: { packageUnitId, packageUnit: { name: packageUnitName = "" } = {} }, package_quantity = 0 } = item;
        if (package_quantity > 0) {
            allPackageUnits.add(packageUnitId);
            packageName = packageUnitName;
        }
    }
    return { needed: allPackageUnits.size > 0, isCommon: allPackageUnits.size === 1, commonName: packageName };
}


export function getProductSpec(product, showAll = true) {
    const { commodity: { name }, productSpecs = [], productIdentifiers = [] } = product;
    const productOrered = [];
    const productOreredZero = [];
    const specsColumn = new Map();
    for (const ps of productSpecs) {
        const { specs: { name: sName, specGroup: { name: sgName, viewAsColumn = false, isVisible, orderOfDisplay } } } = ps;
        if (viewAsColumn) {
            if (isVisible || showAll) {
                specsColumn.set(sgName, sName);
            }
        } else {
            if (isVisible || showAll) {
                if (orderOfDisplay > 0) {
                    productOrered.push({ name: sName, orderOfDisplay });
                } else {
                    productOreredZero.push({ name: sName });
                }
            }
        }
    }
    productOrered.sort((a, b) => a.orderOfDisplay - b.orderOfDisplay);
    productOreredZero.sort((a, b) => a.name.localeCompare(b.name));
    const fullSpecsName = productOrered.map(obj => obj.name).concat(productOreredZero.map(obj => obj.name)).join(" ");
    const productName = fullSpecsName + " " + name;
    const idnColumn = new Map();
    for (const pidn of productIdentifiers) {
        const { data = "", identifier: { name = "" } = {} } = pidn;
        idnColumn.set(name, data);
    }
    return { productName, specsColumn, idnColumn, fullSpecsName, commodityName: name };
}

export function getSpecsColumns(specsKeys, specsColumn) {
    const res = [];
    for (const key of specsKeys) {
        res.push(<td>{specsColumn.has(key) ? specsColumn.get(key) : ""}</td>);
    }
    return res;
}

export function getIdnColumns(identifierKeys, idnColumn) {
    const res = [];
    for (const key of identifierKeys) {
        res.push(<td>{idnColumn.has(key) ? idnColumn.get(key) : ""}</td>);
    }
    return res;
}

export function getTaxColumn(product) {
    const { productTax = [] } = product;
    const txList = [];
    productTax.forEach(pt => {
        const { percent, tax: { type } = {} } = pt;
        txList.push(<span>{type + " - " + percent + "%"}</span>);
    });
    return <td>{txList}</td>;
}

// full product name
export function getProductName(product) {
    const { specsKeys } = getProductColKeys([product]);
    const { fullSpecsName, commodityName, specsColumn } = getProductSpec(product)
    const specs = [];
    for (const key of specsKeys) {
        if (specsColumn.has(key)) {
            specs.push(specsColumn.get(key));
        }
    }
    const specsName = specs.join(" ");
    return fullSpecsName + " " + specsName + " " + commodityName;
}


export function buildPrice(product) {
    const { price, unit: { name = "" } = {} } = product || {};
    return price + " / " + name;
};
