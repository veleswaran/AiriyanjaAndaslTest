import React from "react";
import { convertToIST, isWithinNdays, utcStringToDate } from "../../utilities/timeUtils";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS } from "../../globals/constants";
import { PaymentViewer } from "../paymentViewer";
import { toHex, toJsonString } from "../../utilities/objectUtils";


const PostButton = GetAslModules("PostButton");

export class PaymentRow extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getCancelButton = () => {
        const { data, others = {} } = this.props;
        const { id, clientId } = data;
        const { cancelUrl } = others;
        const poProps = {
            url: cancelUrl,
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to cancel payment"); },
            onSuccess: (rData) => {
                const { result, message } = rData;
                if (result === RESULT_SUCCESS) {
                    this.TOAST.current.showSuccess("Success", "Payment cancelled successfully");
                } else {
                    this.TOAST.current?.showFailed("Unable cancel payment", message || "Unknown error");
                }
            },
            valueGetter: () => ({ id, clientId }),
        }
        return <PostButton key="cancel" varient="outline-danger" size="sm" {...poProps} needConfirmation={true} confirmMessage="Are you sure to Cancel this Payment?" css="bi bi-x-lg"></PostButton>
    }

    showView = () => {
        const { data, others = {} } = this.props;
        const { deductionPayUrl } = others;
        this.POPUP.current.showPopUp("Payment Details", PaymentViewer, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { data, deductionPayUrl } });
    }

    actionRendered = () => {
        const { data } = this.props;
        const { status = "", createdTime } = data;
        const items = [];
        items.push(<button key="view" type="button" className="btn btn-sm btn-outline-dark bi bi-eye" onClick={this.showView}></button>);
        items.push(<button key="view" type="button" className="btn btn-sm btn-outline-dark bi bi-printer" onClick={() => {
            const json = toJsonString(data); const hex = toHex(json);
            window.open("/purchase/printPayment?data=" + hex, "_blank");
        }}></button>);
        if (status === "ACTIVE" && isWithinNdays(utcStringToDate(createdTime), -9)) {
            items.push(this.getCancelButton());
        }
        return items;
    };

    render() {
        const { serial = "", data = {}, } = this.props;
        const { client = {}, amount = 0, createdTime = "", paidAmount = 0, paymentType = {}, status = "", totalDeduction = 0, writeOff = false, deductionPaid = false } = data;
        return <tr className={status == "CANCELLED" ? "text-decoration-line-through" : ""}>
            <td>{serial}</td>
            <td>{client.name || ""}</td>
            <td>{convertToIST(createdTime)}</td>
            <td>{paymentType.name || ""}</td>
            <td>{amount}</td>
            <td>{status.toLowerCase()}</td>
            <td>{writeOff ? "Yes" : "No"}</td>
            <td className="d-flex gap-1">{this.actionRendered()}</td>
        </tr>;
    }
}