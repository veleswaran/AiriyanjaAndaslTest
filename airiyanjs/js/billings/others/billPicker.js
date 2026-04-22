import React from "react";
import { BillSearch } from "../search/billSearch";
import { importASL } from "../../utilities/utilities";
import { convertToIST } from "../../utilities/timeUtils";

export class BillPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { bill: null, validClass: "btn-outline-primary" };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    isValid = () => {
        const { bill } = this.state;
        const valid = bill !== null;
        this.setState({ validClass: valid ? " btn-outline-primary" : " btn-outline-danger" });
        return valid;
    }

    getValue = () => {
        const { bill } = this.state;
        return bill;
    }

    handleClearBill = () => {
        const { onReset } = this.props;
        this.setState({ bill: null }, () => { this.isValid(); onReset?.(); });
    };

    billSelected = (selected) => {
        const { onSelect } = this.props;
        this.setState({ bill: selected }, () => { onSelect?.(); });
    }

    showBillPopup = () => {
        const { urlProcessor, title = "Bill" } = this.props;
        const { url, clientUrl } = urlProcessor ? urlProcessor() : {};
        if (!url) {
            this.TOAST.current.showFailed("Error", "Please select client to proceed");
            return;
        }
        const comProps = { url, clientUrl, onSelect: this.billSelected, };
        this.POPUP.current.showPopUp(`Select ${title}`, BillSearch, 'bg-warning', { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: comProps });
    }

    render() {
        const { title = "Bill", css = "", style = {} } = this.props;
        const { bill, validClass } = this.state;
        return <div className={css} style={style}>
            <label className="form-label">{title}</label>
            {bill ? <BillView bill={bill} handleClearBill={this.handleClearBill} /> : (
                <button type="button" className={`btn ${validClass} w-100`} onClick={this.showBillPopup}>
                    <i className="bi bi-person-plus me-2"></i>
                    Select Bill
                </button>)}
        </div>;
    }
}


class BillView extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { bill, css = "card p-1" } = this.props;
        const { billClient, billNumber, createdTime, totalCost } = bill;
        return (
            <div className={css}>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <table className="table table-borderless table-sm small">
                            <tbody>
                                <tr>
                                    <th colSpan={2} className="fw-bold">{billClient?.billingName}</th>
                                </tr>
                                <tr><th className="text-end text-secondary">Bill Number :</th><td>{billNumber}</td></tr>
                                <tr><th className="text-end text-secondary">Date :</th><td>{convertToIST(createdTime)}</td></tr>
                                <tr><th className="text-end text-secondary">Total Cost :</th><td>{totalCost}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-dark" onClick={this.props.handleClearBill}>Clear</button>
                </div>
            </div>
        )
    }
}