import React from "react";
import { ClientView } from "../clients/clientView";
import { getDefaultClientDetail } from "../clients/utilities";
import { convertToIST } from "../utilities/timeUtils";
import { GetAslModules, importASL } from "../utilities/utilities";
import { RESULT_SUCCESS } from "../globals/constants";

const PostButton = GetAslModules("PostButton");

export class PaymentViewer extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getDudectionPayButton = () => {
        const { data, deductionPayUrl } = this.props;
        const { id, clientId } = data;
        const btnRef = React.createRef(null);
        const poProps = {
            url: deductionPayUrl,
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to pay deduction"); },
            onSuccess: (rData) => {
                const { result, message } = rData;
                if (result === RESULT_SUCCESS) {
                    btnRef.current.disable();
                    data.deductionPaid = true;
                    this.TOAST.current.showSuccess("Success", "Deduction paid successfully");
                } else {
                    this.TOAST.current?.showFailed("Unable to pay deduction", message || "Unknown error");
                }
            },
            valueGetter: () => ({ id, clientId }),
        }
        return <PostButton ref={btnRef} varient="primary" size="sm" {...poProps} needConfirmation={true} confirmMessage="Are you sure to Pay this Deduction?">Pay Now</PostButton>
    }

    getDeductionRows = () => {
        const { data = {}, deductionPayUrl } = this.props;
        const { totalDeduction = 0, deductions = [], writeOff, deductionPaid, status } = data;
        const res = [];
        if (totalDeduction != 0 && deductions.length > 0 && !writeOff) {
            res.push(<tr><td>Total Deduction</td><td></td><td>{totalDeduction}</td></tr>);
            res.push(...deductions.map(d => <tr key={d.id}><td className="text-end">{d.name}</td><td>{d.amount}</td><td></td></tr>));
            res.push(<tr><td>Deduction Paid</td><td></td><td>{deductionPaid ? "Yes" : "No"} {status === "ACTIVE" && !deductionPaid && deductionPayUrl ? this.getDudectionPayButton() : ""}</td></tr>);
        }
        return res;
    }

    render() {
        const { data = {} } = this.props;
        const { client = {}, status, writeOff, createdTime, madeFor, notes, amount, paidAmount, paymentType = {}, purpose = null, referenceDetails } = data;
        return <table className="table table-striped table-bordered table-hover table-sm">
            <tbody className={status === "CANCELLED" ? "text-decoration-line-through" : ""}>
                <tr><td colSpan={3}><ClientView client={client} clientDetail={getDefaultClientDetail(client)} buttonNeeded={false} css="card rounded-0" /></td></tr>
                <tr><td>Date</td><td></td><td>{convertToIST(createdTime)}</td></tr>
                <tr><td>For</td><td></td><td>{madeFor}</td></tr>
                <tr><td>Write-off</td><td></td><td>{writeOff ? "Yes" : "No"}</td></tr>
                <tr><td>Payment Type</td><td></td><td>{paymentType.name}</td></tr>
                <tr className={purpose === null ? "d-none" : ""}><td>Purpose</td><td></td><td>{purpose?.name}</td></tr>
                <tr><td>Amount</td><td></td><td>{amount}</td></tr>
                {this.getDeductionRows()}
                <tr><td>Paid Amount</td><td></td><td className={paidAmount > 0 ? "text-success" : "text-danger"}>{paidAmount}</td></tr>
                <tr><td>Payment Reference</td><td colSpan={2}>{referenceDetails}</td></tr>
                <tr><td>Notes</td><td colSpan={2}>{notes}</td></tr>
            </tbody>
        </table>;
    }
}
