import { toCurrencyF } from "../utilities/conversionutils";

export function getTaxComputation(product, price, quantity) {
    const { productTax = [] } = product;
    const totalPrice = price * quantity;
    const taxed = [];
    let totalTax = 0;
    for (const tx of productTax) {
        const { percent = 0, enabled = false } = tx;
        if (enabled) {
            const tTax = totalPrice * (percent / 100.0);
            totalTax += tTax;
            taxed.push({ value: tTax, detail: tx });
        }
    }
    return { totalPrice, taxed, totalTax };
}

export function getTaxCellData(taxed) {
    const txColumn = [];
    for (const tx of taxed) {
        const { value, detail: { percent = 0, tax: { type = "" } } = {} } = tx;
        txColumn.push(<span>{type + "(" + percent + "%) " + toCurrencyF(value)}</span>);
    }
    return txColumn;
}

export function getViewTaxes(taxes = [], taxKeys = []) {
    const res = [];
    for (const key of taxKeys) {
        let found = false;
        for (const tax of taxes) {
            const { displayName, percent, totalTax } = tax;
            if (key === displayName) {
                found = true;
                res.push(<td className="text-end small">{percent + "%"}</td>);
                res.push(<td className="text-end">{toCurrencyF(totalTax)}</td>);
                break;
            }
        }
        if (!found) {
            res.push(<td></td>);
            res.push(<td></td>);
        }
    }
    return res;
}