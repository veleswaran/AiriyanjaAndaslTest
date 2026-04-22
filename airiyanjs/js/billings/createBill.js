import React from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "react-bootstrap";
import { GetAslModules, importASL } from "../utilities/utilities";
import { BillRow } from "./billRow";
import { SummaryRow } from "./summaryRow";
import { getProductColKeys } from "../materials/products/utilities";
import { RESULT_SUCCESS } from "../globals/constants";
import { ProductSearch } from "../materials/products/productSearch";
import { BillClientPicker } from "./others/billClientPicker";
import { gstVehicleNumberValidator } from "../utilities/validators";

const MultiRender = GetAslModules("MultiRender");
const PostButton = GetAslModules("PostButton");
const TitledTextBox = GetAslModules("TitledTextBox");
const TitledTextArea = GetAslModules("TitledTextArea");

export class CreateBill extends React.Component {
    billRowsRef = React.createRef(null);
    summaryRef = React.createRef(null);
    billclientRef = React.createRef(null);
    vehicleRef = React.createRef(null);
    notesRef = React.createRef(null);
    billDateRef = React.createRef(null);
    invoiceRef = React.createRef(null);
    constructor(props) {
        super(props);
        this.state = { identifierKeys: [], specsKeys: [], taxNeeded: false, packagingColumn: { needed: false, isCommon: false, commonName: "" } };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    listUpdate = () => {
        const allValues = this.billRowsRef.current?.getValue();
        let totalPrice = 0;
        let totalTax = 0;
        let grossTotal = 0;
        for (const val of allValues) {
            const { totalPrice: tPrice, totalTax: tTax, finalPrice } = val;
            totalPrice += tPrice;
            totalTax += tTax;
            grossTotal += finalPrice;
        }
        const { identifierKeys, specsKeys, taxNeeded, packagingColumn } = this.state;
        this.summaryRef.current?.setSummary({ identifierKeys, specsKeys, taxNeeded, totalPrice, totalTax, grossTotal, packagingColumn });
    }

    keyUpdation = (allItems) => {
        const products = [];
        for (const item of allItems) {
            const { props: { product = {} } = {} } = item;
            products.push(product);
        }
        const allKeys = getProductColKeys(products);
        this.setState(allKeys);
        this.billRowsRef.current?.refreshAll(allKeys);
        return allKeys;
    }

    onItemClosed = () => {
        const allItems = this.billRowsRef.current?.getConfigs() || [];
        this.keyUpdation(allItems);
    }

    productSelected = (product) => {
        const allItems = this.billRowsRef.current?.getConfigs() || [];
        allItems.push({ props: { product } });
        const { identifierKeys, specsKeys, taxNeeded, packagingColumn } = this.keyUpdation(allItems);
        this.billRowsRef.current?.add({ props: { product, identifierKeys, specsKeys, taxNeeded, packagingColumn, onUpdate: this.listUpdate, onClose: this.onItemClosed } });
    }

    showProductPicker = () => {
        this.POPUP.current?.showPopUp("Select Product", ProductSearch, "", { modalProps: { fullScreen: true, className: "bg-opacity-75 bg-dark", css: { body: "p-0 mt-1", footer: "visually-hidden" } }, props: { onSelect: this.productSelected } });
    }

    getValue = () => {
        const allValues = this.billRowsRef.current.getValue();
        const note = this.notesRef.current.getValue();
        const { client, bill: { id: previousBillId } = {}, shippedTo, transporter } = this.billclientRef.current.getValue();
        const { clientId, id: clientDetailId } = client;
        const { clientId: shipToClientId, id: shipToClientDetailId } = shippedTo || client;
        let transport = null;
        if (transporter) {
            const { clientId, id: clientDetailId } = transporter;
            transport = { clientId, clientDetailId };
        } else {
            const vehicleNo = this.vehicleRef.current?.getValue() || "";
            if (vehicleNo.trim().length > 0) {
                transport = { vehicleNo };
            }
        }
        const notes = [];
        if (note && note.trim().length > 0) {
            notes.push(note);
        }
        let billDate = null;
        if (this.billDateRef.current) {
            billDate = this.billDateRef.current.getValue();
            if(billDate===""){
                billDate = null;
            }
        }
        let invoiceNumber = null;
        if (this.invoiceRef.current) {
            invoiceNumber = this.invoiceRef.current.getValue();
        }
        const data = { clientId, clientDetailId, items: [], previousBillId, shipToClientId, shipToClientDetailId, transport, notes, billDate, invoiceNumber };
        for (const value of allValues) {
            const { productId, cost, quantity, package_quantity, extraData } = value;
            data.items.push({ productId, cost, quantity, package_quantity, extraData });
        }
        return data;
    }

    validator = () => {
        const { prevBillNeeded = false } = this.props;
        const { client, bill } = this.billclientRef.current.getValue();
        if (prevBillNeeded) {
            if (!bill) {
                this.TOAST.current.showWarning("Bill is not selected", "Select bill to proceed");
                return false;
            }
        }
        if (!client) {
            this.TOAST.current.showWarning("Client is not selected", "Select client");
            return false
        }
        if (this.billRowsRef.current.getValue().length <= 0) {
            this.TOAST.current.showWarning("Added at least one product", "Check the product list and add");
            return false;
        }
        if (!this.billRowsRef.current.isValid()) {
            this.TOAST.current.showWarning("Added product is not valid", "Check all added product");
            return false;
        }
        return true;
    }

    onSuccess = (rData) => {
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            const { id, category } = data;
            this.POPUP.current?.showSuccess("Success", "Bill added successfully", () => {
                window.open("/sales/viewbill?billid=" + id + "&type=" + category, "_blank");
                window.location.reload();
            });
        } else {
            this.TOAST.current?.showFailed("Unable to bill it", message || "Unknown error");
        }
    }

    onError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to add bill try again later");
    }

    vehicleValidator = (value) => {
        if (!value || value.trim().length === 0) {
            return true;
        }
        return gstVehicleNumberValidator(value);
    }

    onTransportSelected = () => {
        this.vehicleRef.current?.setDisabled(true);
    }

    onTrasperterReset = () => {
        this.vehicleRef.current?.setDisabled(false);
    }

    render() {
        const { identifierKeys, specsKeys, taxNeeded, packagingColumn } = this.state;
        const { url, buttonTitle = "", clientUrl = "", searchBillBaseUrl, prevBillNeeded = false, category = "", baseUrl, clientType, businessData } = this.props;
        const allHeadings = [];
        [...specsKeys, ...identifierKeys].forEach(name => {
            allHeadings.push(<th scope="col">{name}</th>);
        });
        const { needed, isCommon, commonName: packageName } = packagingColumn;
        if (needed) {
            allHeadings.push(<th scope="col">{isCommon ? packageName : "Package"}</th>);
        }
        return (
            <div className="container-fluid">
                <div className="text-center p-2 h3">{buttonTitle}</div>
                <div className="card">
                    <div className="p-2">
                        <BillClientPicker ref={this.billclientRef} clientUrl={clientUrl} baseUrl={baseUrl} clientType={clientType} businessData={businessData} searchBillBaseUrl={searchBillBaseUrl} prevBillNeeded={prevBillNeeded} transporter={{ onSelect: this.onTransportSelected, onReset: this.onTrasperterReset }} />
                    </div>
                    <div className="card-body p-0">
                        <table className="table table-striped table-hover m-0">
                            <thead className="table-group-divider">
                                <tr>
                                    <th>#</th><th>product id</th><th>Product Name</th>
                                    {allHeadings}
                                    <th>Quantity</th><th>Price</th>
                                    {taxNeeded ? <><th className="text-end">TotalPrice</th><th className="text-end">Tax</th></> : ""}
                                    <th className="text-end">Total</th><th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <MultiRender key="billrows" ref={this.billRowsRef} component={BillRow} onUpdate={this.listUpdate} />
                            </tbody>
                            <SummaryRow key="summary" ref={this.summaryRef} addClick={this.showProductPicker} isCreateBill={true} />
                        </table>
                    </div>
                    <div className="card-footer text-end p-2 d-flex flex-column">
                        <TitledTextBox ref={this.vehicleRef} placeholder="Vehicle Number" type="text" validator={this.vehicleValidator} />
                        <TitledTextBox ref={this.billDateRef} placeholder="Bill Date" type="date" css={"mt-1 " + (["PURCHASE"].includes(category) ? "" : "d-none")} />
                        <TitledTextBox ref={this.invoiceRef} placeholder="Invoice Number" type="text" css={"mt-1 " + (["PURCHASE"].includes(category) ? "" : "d-none")} />
                        <TitledTextArea ref={this.notesRef} placeholder="Notes" />
                        <div className="mt-1">
                            <PostButton url={url} valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text={buttonTitle} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const CreateSalesBill = function (props) {
    const { businessData } = useOutletContext();
    return <CreateBill {...props} url="/service/bill/SALES/add" category="SALES" buttonTitle="Add Sales Bill" clientUrl="/service/client/SALES/search" baseUrl="/service/client" clientType="SALES" businessData={businessData} />
};

export const CreateSalesDc = function (props) {
    const { businessData } = useOutletContext();
    return <CreateBill {...props} url="/service/bill/SALES_DC/add" category="SALES_DC" buttonTitle="Add Sales DC" clientUrl="/service/client/SALES/search" baseUrl="/service/client" clientType="SALES" businessData={businessData} />
};

export const CreateJobWork = function (props) {
    const { businessData } = useOutletContext();
    return <CreateBill {...props} url="/service/bill/JOB_WORK/add" category="JOB_WORK" buttonTitle="Add Job Work" clientUrl="/service/client/SALES/search" baseUrl="/service/client" clientType="SALES" businessData={businessData} />
};

export const createCreditNote = function (props) {
    const { businessData } = useOutletContext();
    return <CreateBill {...props} url="/service/bill/CREDIT_NOTE/add" category="CREDIT_NOTE" buttonTitle="Add Credit Note" clientUrl="/service/client/SALES/search" prevBillNeeded={true} searchBillBaseUrl="/service/bill/SALES/search/live" baseUrl="/service/client" clientType="SALES" businessData={businessData} />
};

export const createPurchaseBill = function (props) {
    const { businessData } = useOutletContext();
    return <CreateBill {...props} url="/service/bill/PURCHASE/add" category="PURCHASE" buttonTitle="Add Purchase Bill" clientUrl="/service/client/PURCHASE/search" baseUrl="/service/client" clientType="PURCHASE" businessData={businessData} />
};

export const createDebitNote = function (props) {
    const { businessData } = useOutletContext();
    return <CreateBill {...props} url="/service/bill/DEBIT_NOTE/add" category="DEBIT_NOTE" buttonTitle="Add Debit Note" clientUrl="/service/client/PURCHASE/search" prevBillNeeded={true} searchBillBaseUrl="/service/bill/PURCHASE/search/live" baseUrl="/service/client" clientType="PURCHASE" businessData={businessData} />
};
