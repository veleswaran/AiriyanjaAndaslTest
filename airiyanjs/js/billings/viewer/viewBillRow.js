import React from "react";
import { uuidv4 } from "../../utilities/uuidv4";
import { getProductSpec } from "../../materials/products/utilities";
import { toCurrencyF } from "../../utilities/conversionutils";
import { getSpecsColumns, getIdnColumns } from "../../materials/products/utilities";
import { getViewTaxes } from "../utilities";

export class ViewBillRow extends React.Component {
    constructor(props) {
        super(props)
        this.state = { uuid: uuidv4() };
    }

    getPackageCell = () => {
        const { packagingColumn: { needed = false, isCommon = false }, item = {} } = this.props;
        const { product, package_quantity } = item;
        const { packageUnit: { name: packageUnitName = "" } = {} } = product;
        if (needed) {
            if (package_quantity > 0) {
                return <td>{package_quantity + " " + (isCommon ? "" : packageUnitName)}</td>;
            }
            return <td></td>;
        }
        return "";
    }

    render() {
        const { uuid } = this.state;
        const { serial, specsKeys = [], identifierKeys = [], taxNeeded = false, taxKeys = [], packagingColumn: { needed = false, isCommon = false, commonName = "" }, item = {}, isDummy = false } = this.props;
        if (isDummy) {
            const totalCells = 6 + specsKeys.length + identifierKeys.length + (taxNeeded ? 1 + (taxKeys.length * 2) : 0) + (needed ? 1 : 0);
            const cells = [];
            for (let index = 0; index < totalCells; index++) {
                cells.push(<td className="p-0"><div className="bg-white" style={{ height: "30px" }}></div></td>)
            }
            return <tr>{cells}</tr>;
        }
        const { product, cost, quantity, taxes, extra = [] } = item;
        const { localId, unit: { name: unitName } } = product;
        const { productName, specsColumn, idnColumn } = getProductSpec(product, false);
        const totalPrice = cost * quantity;
        let totalTax = 0;
        for (const tx of taxes) {
            totalTax += tx.totalTax;
        }
        let extraCells;
        if (extra.length > 0) {
            let cData = [];
            for (const ex of extra) {
                const { label, data } = ex;
                cData.push(<span>{ ` ${label.toLowerCase()}: `}<strong>{data}</strong></span>);
            }
            extraCells = <tr><td></td><td></td><td colSpan={200} className="small">{cData}</td></tr>;
        }
        return (
            <>
                <tr key={uuid}>
                    <th className="text-center">{serial}</th>
                    <td>{localId}</td>
                    <td>{productName}</td>
                    {getSpecsColumns(specsKeys, specsColumn)}
                    {getIdnColumns(identifierKeys, idnColumn)}
                    {this.getPackageCell()}
                    <td key="quantity">{quantity}<span className="small">{" " + unitName}</span></td>
                    <td key="price">{cost}<span className="small">{" / " + unitName}</span></td>
                    {taxNeeded ? <><td className="text-end"><span>{toCurrencyF(totalPrice)}</span></td>{getViewTaxes(taxes, taxKeys)}</> : ""}
                    <td className="fw-bold text-end">{toCurrencyF(totalTax + totalPrice)}</td>
                </tr>
                {extraCells}
            </>
        );
    }
}