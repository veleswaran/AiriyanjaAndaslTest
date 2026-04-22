import React from "react";
import { Button } from "react-bootstrap";
import { toCurrencyF, toIndianCurrencyF } from "../utilities/conversionutils";
import { ToWords } from 'to-words';

const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
            name: 'Rupee',
            plural: 'Rupees',
            symbol: '₹',
            fractionalUnit: {
                name: 'Paisa',
                plural: 'Paise',
                symbol: '',
            },
        },
    },
});


export class SummaryRow extends React.Component {
    constructor(props) {
        super(props);
        const { specsKeys = [], identifierKeys = [], taxNeeded = false, taxKeys = [], totalPrice = 0, totalTax = 0, grossTotal = 0, isCreateBill = true, packagingColumn = {} } = this.props;
        this.state = { specsKeys, identifierKeys, taxNeeded, taxKeys, totalPrice, totalTax, grossTotal, disabled: false, packagingColumn };
    }

    setEnabled = (enabled) => {
        this.setState({ disabled: !enabled });
    }

    setSummary = (data) => {
        this.setState({ ...data });
    }

    getTaxCell = () => {
        const { isCreateBill = true, billData = {} } = this.props;
        const { items = [] } = billData;
        const { taxKeys, totalTax } = this.state;
        const taxMap = new Map();
        if (isCreateBill === false) {
            for (const item of items) {
                const { taxes = [] } = item;
                for (const tx of taxes) {
                    const { displayName, percent, totalTax } = tx;
                    if (!taxMap.has(displayName)) {
                        taxMap.set(displayName, 0);
                    }
                    taxMap.set(displayName, taxMap.get(displayName) + totalTax);
                }
            }
            const res = [];
            for (const txKey of taxKeys) {
                res.push(<td></td>);
                if (taxMap.has(txKey)) {
                    res.push(<td className="text-end">{toCurrencyF(taxMap.get(txKey))}</td>);
                } else {
                    res.push(<td></td>);
                }
            }
            return res;
        }
        return <td className="text-end">{toCurrencyF(totalTax)}</td>;
    }

    render() {
        const { specsKeys, identifierKeys, taxNeeded, taxKeys, totalPrice, grossTotal, disabled, packagingColumn } = this.state;
        const { addClick, actionNeeded = true, showOtherDetails = false, billData = {}, businessName = "", businessData = {} } = this.props;
        const { details = [] } = businessData;
        const { billClient: { billingName = "" } = {}, rounding = 0, items = [] } = billData;
        let otherDetails = [];
        if (showOtherDetails) {
            otherDetails = [
                <tr>
                    <td colSpan={500}>
                        <strong>Declarations: </strong>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                    </td>
                </tr>,
                <tr>
                    <td colSpan={500}>
                        <div className="row m-0">
                            <div className="col">
                                <div style={{ "minHeight": "80px", }} className="align-content-end p-2">
                                    For {billingName}
                                </div>
                            </div>
                            <div className="col text-end border-start">
                                <div style={{ "minHeight": "80px", }} className="align-content-end p-2">
                                    For {businessName}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>,
                <tr>
                    <td colSpan={500} class="text-secondary-emphasis fst-italic text-center text-xs p-0">
                        This is a computer-generated invoice. Hence, a signature may not be required.
                        <div style={{ borderImage: "linear-gradient(to right, #F0F, #FF0, #0FF, #F0F) 1", borderBottom: "2px solid" }}></div>
                    </td>
                </tr>
            ];
            if (details.length > 0) {
                const typeDetail = {};
                for (const det of details) {
                    const { type } = det;
                    typeDetail[type] = det;
                }
                const { BANK_DETAIL, TERMS } = typeDetail;
                let bankDetails = null;
                if (BANK_DETAIL) {
                    const { arrayData = [] } = BANK_DETAIL;
                    bankDetails = <table className="w-100">
                        <thead>
                            <tr>
                                <th colSpan={3} className="text-decoration-underline">Bank Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processBankDetails(arrayData)}
                        </tbody>
                    </table>;
                }
                let termsDetails = null;
                if (TERMS) {
                    const { arrayData = [] } = TERMS;
                    termsDetails = <table>
                        <thead>
                            <tr>
                                <th className="text-decoration-underline">Terms and Conditions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processTerms(arrayData)}
                        </tbody>
                    </table>;
                }
                let taxSummary = null;
                if (taxNeeded) {
                    taxSummary = getTaxSummary(items, taxKeys);
                }
                if (bankDetails || termsDetails || taxSummary) {
                    otherDetails.unshift(
                        <tr>
                            <td colSpan={500} className="p-0">
                                <div className="row m-0">
                                    {taxSummary ? <div className="col p-1">{taxSummary}</div> : ""}
                                    {bankDetails ? <div className={"col " + (taxSummary ? "border-start" : "")}>{bankDetails}</div> : ""}
                                    {termsDetails ? <div className={"col small " + (taxSummary || bankDetails ? "border-start" : "")}>{termsDetails}</div> : ""}
                                </div>
                            </td>
                        </tr>
                    );
                }

            }
        }
        const { needed = false } = packagingColumn;
        let roundingRow = "";
        if (rounding) {
            roundingRow = <tr>
                <td className="text-end" colSpan={5 + specsKeys.length + identifierKeys.length + (needed ? 1 : 0) + (taxNeeded ? 1 + (taxKeys.length * 2) : 0)}>Round off</td>
                <td className="text-end">{rounding}</td>
            </tr>;
        }
        return <tfoot>
            {roundingRow}
            <tr>
                <td className="text-end fw-bolder" colSpan={5 + specsKeys.length + identifierKeys.length + (needed ? 1 : 0)}>Grand Total</td>
                {taxNeeded ? <> <td className="text-end">{toCurrencyF(totalPrice)}</td>{this.getTaxCell()}</> : ""}
                <td className="text-end fw-bolder">{toIndianCurrencyF(grossTotal)}</td>
                {actionNeeded ? <td className="text-end">
                    <Button variant="secondary" disabled={disabled} onClick={addClick} >+</Button>
                </td> : ""
                }
            </tr>
            <tr className="small">
                <td className="text-end" colSpan={4}>Total amount in words :</td>
                <td colSpan={200} className="fw-bolder text-end">
                    {toWords.convert(grossTotal)}
                </td>
            </tr>
            {otherDetails}
        </tfoot>
    }
}

function processBankDetails(details = []) {
    let res = [];
    for (const det of details) {
        const splited = det.split(":");
        if (splited.length > 1) {
            res.push(<tr>
                <td className="text-capitalize ps-3">{splited[0].toLowerCase()}</td>
                <td className="text-center">:</td>
                <td>{splited[1]}</td>
            </tr>);
        }
    }
    return res;
}

function processTerms(details = []) {
    let res = [];
    for (const det of details) {
        res.push(<tr><td className="ps-3">{det}</td></tr>);
    }
    return res;
}


function getTaxSummary(items, taxKeys) {
    const gstKeyList = taxKeys;
    const mappedTaxSummary = new Map();
    const totalTaxes = new Map();
    for (const billItem of items) {
        const { taxes = [] } = billItem
        for (const tx of taxes) {
            const { displayName, totalTax, percent } = tx;
            if (gstKeyList.includes(displayName)) {
                if (!mappedTaxSummary.has(percent)) {
                    mappedTaxSummary.set(percent, {});
                }
                mappedTaxSummary.get(percent)[displayName] = (mappedTaxSummary.get(percent)[displayName] || 0) + totalTax;
                if (!totalTaxes.has(displayName)) {
                    totalTaxes.set(displayName, 0);
                }
                totalTaxes.set(displayName, totalTaxes.get(displayName) + totalTax);
            }
        }
    }
    const percentKeys = [...mappedTaxSummary.keys()].sort();
    const rows = [];
    let tSgst = 0;
    let tCgst = 0;
    let tIgst = 0;
    for (const pck of percentKeys) {
        const percentVal = mappedTaxSummary.get(pck);
        const cells = []
        cells.push(<td>{pck}</td>);
        for (const txkey of taxKeys) {
            if (percentVal[txkey]) {
                cells.push(<td>{percentVal[txkey]}</td>);
            } else {
                cells.push(<td></td>);
            }
        }
        rows.push(<tr>{cells}</tr>);
    }
    return <table className="table table-sm table-bordered m-0">
        <thead>
            <tr><td>%</td>{taxKeys.map((key) => (<td>{key}</td>))}</tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
        <tfoot>
            <tr><th>Total</th>{taxKeys.map((key) => (<td>{totalTaxes.has(key) ? totalTaxes.get(key) : ""}</td>))}</tr>
        </tfoot>
    </table>;
}