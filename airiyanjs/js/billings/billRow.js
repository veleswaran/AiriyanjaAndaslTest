import React from "react";
import { getTaxCellData, getTaxComputation } from "./utilities";
import { getProductSpec, getIdnColumns, getSpecsColumns } from "../materials/products/utilities";
import { GetAslModules } from "../utilities/utilities";
import { uuidv4 } from "../utilities/uuidv4"
import { toCurrencyF, toUnitF } from "../utilities/conversionutils";
import { PRODUCT_CATEGORIES } from "../materials/products/enums/productCategories";
import { BobinPricing } from "./others/bobinPricing";


const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const TitledSelect = GetAslModules("TitledSelect");
const DecimalTextBox = GetAslModules("DecimalTextBox");


export class BillRow extends React.Component {
    priceRef = React.createRef(null);
    quantityRef = React.createRef(null);
    packageRef = React.createRef(null);
    bobinRef = React.createRef(null);
    constructor(props) {
        super(props);
        const { specsKeys = [], identifierKeys = [], taxNeeded = false, product = {}, packagingColumn = {} } = this.props;
        const { price } = product;
        const { productName, specsColumn, idnColumn } = getProductSpec(product);
        const pr = toCurrencyF(price);
        const { totalPrice, taxed, totalTax } = getTaxComputation(product, pr, 1)
        this.state = {
            prodDetails: { productName, specsColumn, idnColumn },
            specsKeys,
            identifierKeys,
            packagingColumn,
            taxNeeded,
            price: pr,
            quantity: 1, totalPrice, taxed, totalTax,
            disabled: false,
            uuid: uuidv4(),
            package_quantity: 0
        };
    }

    componentDidUpdate() {
        const { onUpdate } = this.props;
        if (onUpdate) {
            onUpdate();
        }
    }

    refresh = (data) => {
        const { identifierKeys: ik, specsKeys: sk, taxNeeded: tn, packagingColumn: pc } = this.state;
        const { identifierKeys = ik, specsKeys = sk, taxNeeded = tn, packagingColumn = pc } = data;
        this.setState({ identifierKeys, specsKeys, taxNeeded, packagingColumn });
    }

    disabled = (disabled) => {
        this.setState({ disabled });
    }

    getValue = () => {
        const { product: { id, category } = {} } = this.props;
        const { price, quantity, totalPrice, taxed, totalTax, package_quantity } = this.state;
        let extraData = [];
        switch (category) {
            case PRODUCT_CATEGORIES.BOBIN:
                extraData = this.bobinRef.current.getValue();
                break;
        }
        let finalPrice = totalPrice + totalTax;
        return { productId: id, cost: price, quantity, taxed, totalTax, totalPrice, finalPrice, package_quantity, extraData };
    }

    isValid = () => {
        const { product = {} } = this.props;
        const { category } = product;
        switch (category) {
            case PRODUCT_CATEGORIES.BOBIN:
                if (this.bobinRef.current && !this.bobinRef.current.isValid()) {
                    return false;
                }
        }
        const { price, quantity } = this.state;
        if (price > 0 && quantity > 0) {
            return true;
        }
        return false;
    }

    valueChaged = () => {
        const { product = {} } = this.props;
        let price = toCurrencyF(this.priceRef.current?.getValue() || 0);
        let quantity = toUnitF(this.quantityRef.current?.getValue() || 0);
        price = price < 0 ? 0 : price;
        quantity = quantity < 0 ? 0 : quantity;
        const { totalPrice, taxed, totalTax } = getTaxComputation(product, price, quantity)
        const package_quantity = this.packageRef.current?.getValue() || 0;
        this.setState({ price, quantity, totalPrice, taxed, totalTax, package_quantity });
        if (this.bobinRef.current) {
            this.bobinRef.current.updateTotalPrice(totalPrice);
        }
    }

    onSpecialUpdate = (SpecialtotalPrice = 0) => {
        const { product = {} } = this.props;
        let price = toCurrencyF(this.priceRef.current?.getValue() || 0);
        let quantity = toUnitF(this.quantityRef.current?.getValue() || 0);
        price = price < 0 ? 0 : price;
        quantity = quantity < 0 ? 0 : quantity;
        if (SpecialtotalPrice) {
            price = SpecialtotalPrice / quantity;
            this.priceRef.current.setValue(price);
        }
        const { totalPrice, taxed, totalTax } = getTaxComputation(product, price, quantity)
        const package_quantity = this.packageRef.current?.getValue() || 0;
        this.setState({ price, quantity, totalPrice, taxed, totalTax, package_quantity });
    }

    getPackageCell = () => {
        const { product = {} } = this.props;
        const { packageUnit: { name: packageUnitName = "" } = {}, packageUnitId } = product;
        const { packagingColumn, package_quantity } = this.state;
        const { needed = false, isCommon = false } = packagingColumn;
        if (needed) {
            if (packageUnitId) {
                return <td key="packaging">
                    <div className="input-group">
                        <DecimalTextBox positiveOnly={true} ref={this.packageRef} value={package_quantity} onChange={this.valueChaged} />
                        {isCommon ? "" : <span className="input-group-text">{packageUnitName}</span>}
                    </div>
                </td>
            } else {
                return <td key="packaging"></td>
            }
        }
        return "";
    }

    render() {
        const { serial = "", product = {}, onClose } = this.props;
        const { localId, unit: { name: unitName } = {}, category } = product;
        const { specsKeys, identifierKeys, taxNeeded, prodDetails, price, quantity, totalPrice, taxed, totalTax, uuid } = this.state;
        const { productName, specsColumn, idnColumn } = prodDetails;
        return (
            <tr key={uuid} className="align-middle">
                <th>{serial}</th>
                <td>{localId}</td>
                <td className="w-25">{productName}</td>
                {getSpecsColumns(specsKeys, specsColumn)}
                {getIdnColumns(identifierKeys, idnColumn)}
                {this.getPackageCell()}
                <td key="quantity">
                    <div className="input-group">
                        <DecimalTextBox positiveOnly={true} ref={this.quantityRef} value={quantity} onChange={this.valueChaged} />
                        <span className="input-group-text">{unitName}</span>
                    </div>
                </td>
                <td key="price">
                    <div className="input-group">
                        <DecimalTextBox positiveOnly={true} ref={this.priceRef} value={price} onChange={this.valueChaged} />
                        <span className="input-group-text">/{unitName}</span>
                    </div>
                    {
                        category === PRODUCT_CATEGORIES.BOBIN ? <BobinPricing ref={this.bobinRef} onUpdate={this.onSpecialUpdate} css="mt-1" /> : ""
                    }
                </td>
                {taxNeeded ? <td className="text-end"><span>{toCurrencyF(totalPrice)}</span></td> : ""}
                {taxNeeded ? <td className="text-end">{getTaxCellData(taxed)}</td> : ""}
                <td className="fw-bold text-end">{toCurrencyF(totalTax + totalPrice)}</td>
                <td className="text-end"><button className="btn btn-danger" onClick={onClose}>X</button></td>
            </tr>
        );
    }
}


function getPackagingCell(packagingColumn) {
    const { needed = false, isCommon = false, name = "" } = packagingColumn;
    return
}