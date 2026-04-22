import React from "react";
import { importASL, GetAslModules, getQueryParam } from "../../utilities/utilities";
import { ViewBillRow } from "./viewBillRow";
import { getPackageColumnFromItem, getProductColKeys } from "../../materials/products/utilities";
import { SummaryRow } from "../summaryRow";
import { BillDetail } from "./billDetail";
import { RESULT_SUCCESS } from "../../globals/constants";
import { useOutletContext } from "react-router-dom";

import "../../css/print.css";
import { sanitizeForFilePath } from "../../utilities/uiUtils";
import { EwayCancel } from "../others/ewayCancel";
import TransportChanger from "../others/transportChanger";
import { getGstErrorMessage } from "../../externalsystems/gstErorList";
const MultiRender = GetAslModules("MultiRender");
const PostButton = GetAslModules("PostButton");

export class ViewBill extends React.Component {
    rowsRef = React.createRef(null);
    summaryRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = {};
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
        this.loadData();
    }

    loadData = (refresh = false) => {
        const { fetchData = true, data = {} } = this.props;
        if (fetchData) {
            const { billid = 0, type = "" } = getQueryParam();
            this.callApi("/service/bill/" + type + "/get", { id: billid });
        } else {
            if (refresh) {
                const { id, category } = data;
                this.callApi(`/service/bill/${category}/get`, { id });
            } else {
                this.processBillData(data);
            }
        }
    }

    callApi = (url, body) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        ).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        }).then(this.processSuccess).catch(this.processError);
    }

    processSuccess = (rData) => {
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            this.processBillData(data);
        } else {
            this.TOAST.current?.showFailed("Unable get Bill details", message || "Unknown error");
        }
    }

    processError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to get bill details, try again later");
    }

    showTransportChanger = () => {
        const { billData = {} } = this.state;
        this.POPUP.current?.showPopUp("Change Transporter", TransportChanger, "", { modalProps: { className: "bg-opacity-75 bg-dark", css: { body: "p-1", footer: "visually-hidden" } }, props: { billData, onSuccess: () => { this.loadData(true); } } });
    }

    getMenus = () => {
        const { billData } = this.state;
        if (!billData) {
            return [];
        }
        const { id, category, status, eway } = billData;
        const cancelProps = {
            url: `/service/bill/${category}/cancel`,
            onError: () => {
                this.TOAST.current.showFailed("Something went wrong", "Unable to change the state");
            },
            onSuccess: (data) => {
                if (data.result === RESULT_SUCCESS) {
                    this.TOAST.current.showSuccess("Success", "Bill cancelled successfully");
                    this.loadData(true);
                    return;
                }
                this.TOAST.current.showFailed("Error", data.message);
            },
            valueGetter: () => ({ id }),
        };

        const approveProps = {
            url: `/service/bill/${category}/make_live`,
            onError: () => {
                this.TOAST.current.showFailed("Something went wrong", "Unable to change the state");
            },
            onSuccess: (data) => {
                if (data.result === RESULT_SUCCESS) {
                    this.TOAST.current.showSuccess("Success", "Bill approved successfully");
                    this.loadData(true);
                    return;
                }
                this.TOAST.current.showFailed("Unsuccess", data.message);
            },
            valueGetter: () => ({ id }),
        };
        const ewayProps = {
            url: `/service/billeway/${category}/getewaybill`,
            onError: () => {
                this.TOAST.current.showFailed("Something went wrong", "Unable to create E-Way bill");
            },
            onSuccess: (data) => {
                if (data.result === RESULT_SUCCESS) {
                    this.TOAST.current.showSuccess("Success", "E-Way bill created successfully");
                    this.loadData(true);
                    return;
                }
                const errorMessages = getGstErrorMessage(data.message);
                this.TOAST.current.showFailed("Unsuccess", errorMessages.join(", "));
            },
            valueGetter: () => ({ id }),
        };
        const buttons = [];
        if (status === "DRAFT") {
            buttons.push(
                <li>
                    <PostButton size="sm" key="approve" {...approveProps} needConfirmation confirmMessage="Are you sure to Approve this bill?" css="dropdown-item" varient="outline-success">
                        Approve
                    </PostButton>
                </li>
            );
        }
        if (status !== "CANCELLED") {
            buttons.push(
                <li><PostButton size="sm" key="cancel" {...cancelProps} needConfirmation confirmMessage="Are you sure to Cancel this bill?" varient="outlined" css="dropdown-item">
                    Cancel bill
                </PostButton></li>
            );
        }
        if (status === "ACTIVE" || status === "DRAFT") {
            buttons.push(
                <li><button className="btn btn-sm dropdown-item" onClick={this.showTransportChanger}>Change Transporter</button></li>
            );
        }
        const allowedEwayCategories = new Set(["SALES", "JOB_WORK"]);
        if (allowedEwayCategories.has(category) && status === "ACTIVE") {
            if (eway) {
                buttons.push(
                    <li><button className="btn btn-sm dropdown-item" onClick={this.showEwayCancel}>Cancel E-Way Bill</button></li>
                );
            } else {
                buttons.push(
                    <li><PostButton size="sm" key="cancel" {...ewayProps} needConfirmation confirmMessage="Are you sure to create this bill?" css="dropdown-item" varient="outline-danger">
                        Create E-Way Bill
                    </PostButton></li>
                );
            }
        }
        return buttons;
    }

    showEwayCancel = () => {
        const { billData = {} } = this.state;
        const { id, category } = billData;
        this.POPUP.current?.showPopUp("Cancel E-Way Bill", EwayCancel, "", { modalProps: { className: "bg-opacity-75 bg-dark", css: { body: "p-1 mt-1", footer: "visually-hidden" } }, props: { onSuccess: () => { this.loadData(true) }, billId: id, category } });
    }

    processBillData = (billData) => {
        const products = [];
        const { items = [], totalCost } = billData || {};
        let taxNeeded = false;
        const taxKeyset = new Set();
        let totalTax = 0;
        let totalPrice = 0;
        for (const item of items) {
            const { product, taxes = [], cost = 0, quantity = 0 } = item;
            totalPrice += cost * quantity;
            if (product) {
                products.push(product);
            }
            if (taxes && taxes.length > 0) {
                taxNeeded = true;
                for (const tx of taxes) {
                    const { totalTax: tTax, displayName } = tx;
                    totalTax += tTax || 0;
                    taxKeyset.add(displayName);
                }
            }
        }
        const taxKeys = [...taxKeyset];
        const { specsKeys, identifierKeys } = getProductColKeys(products, false);
        const packagingColumn = getPackageColumnFromItem(items);
        this.setState({ specsKeys, identifierKeys, taxNeeded, taxKeys, billData, packagingColumn });
        this.rowsRef.current?.clear();
        for (const item of items) {
            this.rowsRef.current.add({ props: { specsKeys, identifierKeys, packagingColumn, taxNeeded, taxKeys, item } });
        }
        for (let index = 0; index < (10 - items.length); index++) {
            this.rowsRef.current.add({ props: { specsKeys, identifierKeys, packagingColumn, taxNeeded, taxKeys, isDummy: true } });
        }
        this.summaryRef.current?.setSummary({
            identifierKeys, specsKeys, taxNeeded, taxKeys, packagingColumn,
            totalPrice, totalTax, grossTotal: totalCost
        });
    }

    render() {
        const { businessData = {}, needPageBreak } = this.props;
        const { address, address2, pinCode, country, displayName, fssai, gst, mobile, name, state, legalName, email } = businessData;
        const addrs = [];
        const location = []
        const businessName = displayName ? displayName : name;
        if (address) {
            addrs.push(address);
        }
        if (address2) {
            addrs.push(address2);
        }
        if (pinCode) {
            addrs.push(pinCode);
        }
        if (state) {
            location.push(state);
        }
        if (country) {
            location.push(country);
        }
        const Ids = [];
        if (gst) {
            Ids.push("GST: " + gst);
        }
        if (fssai) {
            Ids.push("FSSAI: " + fssai);
        }
        const specialDisplay = [];
        const contacts = [];
        if (mobile) {
            contacts.push("Mobile: " + mobile);
        }
        if (email) {
            contacts.push("Email: " + email);
        }
        if (contacts.length > 0) {
            specialDisplay.push(<div className="text-center fst-italic">{contacts.join(", ")}</div>);
        }
        if (Ids.length > 0) {
            specialDisplay.push(<div className="text-center fst-italic">{Ids.join(", ")}</div>);
        }
        const { billData, identifierKeys = [], specsKeys = [], taxNeeded = false, taxKeys = [], packagingColumn: { needed: packageNeeded = false, isCommon = false, commonName = "" } = {} } = this.state;
        const allHeadings = [];
        const rowSpan = taxNeeded ? 2 : 0;
        [...specsKeys, ...identifierKeys].forEach(name => {
            allHeadings.push(<th rowSpan={rowSpan} scope="col">{name}</th>)
        });
        if (packageNeeded) {
            allHeadings.push(<th rowSpan={rowSpan} scope="col">{isCommon ? commonName : "Packaging"}</th>)
        }
        // const colSpan = allHeadings.length + 7 + (taxNeeded ? taxKeys.length : 0);
        const { category = "", status = "", billClient: { billingName = "" } = {}, billNumber = "-" } = billData || {}
        let billTitle = '';
        switch (category) {
            case "SALES":
                billTitle = (status === "DRAFT") ? "Sales Quotation(Draft)" : "Sales - Tax invoice";
                break;
            case "PURCHASE":
                billTitle = (status === "DRAFT") ? "Purchase invoice(Draft)" : "Purchase invoice";
                break;
            case "SALES_DC":
                billTitle = (status === "DRAFT") ? "Sales Delivery challan(Draft)" : "Sales Delivery challan";
                break;
            case "PURCHASE_DC":
                billTitle = (status === "DRAFT") ? "Purchase Delivery challan(Draft)" : "Purchase Delivery challan";
                break;
            case "CREDIT_NOTE":
                billTitle = (status === "DRAFT") ? "Credit Note(Draft)" : "Credit Note";
                break;
            case "DEBIT_NOTE":
                billTitle = (status === "DRAFT") ? "Debit Note(Draft)" : "Debit Note";
                break;
            case "JOB_WORK":
                billTitle = (status === "DRAFT") ? "Job Work challan(Draft)" : "Job Work challan";
                break;

        }
        document.title = sanitizeForFilePath(billTitle + " - " + billingName + " - " + billNumber);
        return <>
            <table className={"align-middle table table-striped table-bordered" + (status === "CANCELLED" ? " text-decoration-line-through" : "")}>
                <thead>
                    <tr className="printHide">
                        <td colSpan={500} className="text-end">
                            <div className="nav d-block">
                                <button className="btn btn-sm btn-primary border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    {this.getMenus()}
                                </ul>
                            </div>

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={500} className="bg-secondary-subtle">
                            <p className="h3 m-0 fw-semibold">{billTitle}</p>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={500}>
                            <div className="d-flex">
                                <div className="align-content-center text-center" style={{ width: "120px" }}>
                                    <img src="/service/entities/logo" className="rounded-1" alt="logo" style={{ maxHeight: "100px", maxWidth: "100px" }} onError={(e) => { if (e.target.parentNode) { e.target.parentNode.style.display = "none"; } }} />
                                </div>
                                <div className="flex-fill align-content-center">
                                    <div className="h1 text-center text-uppercase fw-bold m-0">{businessName}</div>
                                    {legalName ? <div className="text-center">{legalName}</div> : ""}
                                    <div style={{ maxWidth: "70%" }} className="text-center fst-italic text-capitalize mx-auto">{addrs.join(", ")}<br />{location.join(", ")}</div>
                                    {specialDisplay}
                                </div>
                                <div className="align-content-center text-center" style={{ width: "120px" }}>
                                    <img src="/service/entities/logosecondary" className="rounded-1" alt="logo" style={{ maxHeight: "100px", maxWidth: "100px" }} onError={(e) => { if (e.target.parentNode) { e.target.parentNode.style.display = "none"; } }} />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="p-0" colSpan={500}>
                            {billData ? <BillDetail data={billData} businessData={businessData} /> : ""}
                        </td>
                    </tr>
                    <tr>
                        <th rowSpan={rowSpan} className="text-center">#</th>
                        <th rowSpan={rowSpan}>PID</th>
                        <th rowSpan={rowSpan}>Product Name</th>
                        {allHeadings}
                        <th rowSpan={rowSpan} >Quantity</th>
                        <th rowSpan={rowSpan} >Price</th>
                        {taxNeeded ? <><th rowSpan={rowSpan} className="text-end">TotalPrice</th><th colSpan={taxKeys.length * 2} className="text-center">Tax</th></> : ""}
                        <th rowSpan={rowSpan} className="text-end">Total</th>
                    </tr>
                    {taxNeeded ? <tr>{taxKeys.map((name) => <> <th colSpan={2} className="text-center small">{name}</th></>)}</tr> : ""}
                </thead>
                <tbody>
                    <MultiRender ref={this.rowsRef} component={ViewBillRow} />
                </tbody>
                <SummaryRow ref={this.summaryRef} actionNeeded={false} showOtherDetails={true} isCreateBill={false} billData={billData} businessName={businessName} businessData={businessData} />
            </table>
            {needPageBreak ? <div className="border-top my-3 border-3 border-black"></div> : ""}
        </>;
    }
}

export const Component = function (props) {
    const { isLoggedIn, businessData } = useOutletContext();
    return <ViewBill {...props} isLoggedIn={isLoggedIn} businessData={businessData} />;
};

export const RenderBill = function (props) {
    const { isLoggedIn, businessData } = useOutletContext();
    return <ViewBill {...props} fetchData={false} isLoggedIn={isLoggedIn} businessData={businessData} />;
}
