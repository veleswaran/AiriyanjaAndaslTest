import React from "react";
import { convertToISTDate, isWithinNdays, utcStringToDate } from "../../../../utilities/timeUtils";
import { objectToQueryString } from "../../../../utilities/objectUtils";
import { ViewClothChallan } from "../viewClothChallan";
import { GetAslModules, importASL } from "../../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../../globals/constants";
import { uuidv4 } from "../../../../utilities/uuidv4";

const PostButton = GetAslModules("PostButton");

export class ChallanSearchRow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    showClothChallanView = (data) => {
        this.POPUP.current.showPopUp("Cloth Challan Details", ViewClothChallan, "bg-warning", { modalProps: { fullScreen: true, className: "bg-opacity-75 bg-dark", css: { body: "p-1", footer: "visually-hidden" } }, props: { data } });
    }

    onApproveSuccess = (ddata) => {
        const { data = {} } = this.props;
        if (ddata.result === RESULT_SUCCESS) {
            data.status = 'COMPLETED';
            this.TOAST.current.showSuccess("Success", "Challan approved successfully");
            this.setState({ uid: uuidv4() });
        } else {
            this.TOAST.current.showFailed("Unsuccess", ddata.message);
        }
    }

    onCancelSuccess = (ddata) => {
        const { data = {} } = this.props;
        if (ddata.result === RESULT_SUCCESS) {
            data.status = 'CANCELLED';
            this.TOAST.current.showSuccess("Success", "Challan cancelled successfully");
            this.setState({ uid: uuidv4() });
        } else {
            this.TOAST.current.showFailed("Unsuccess", ddata.message);
        }
    }

    getAction = () => {
        const { data = {} } = this.props;
        const { status, id, clientId, updatedTime } = data;
        const controls = [];
        controls.push(<button className="btn btn-sm btn-outline-secondary" onClick={() => this.showClothChallanView(data)}>View</button>);
        controls.push(<span><i class="bi bi-printer btn btn-sm btn-outline-secondary" onClick={() => {
            const qryString = objectToQueryString({ challanId: data.id });
            window.open("/loom/printclothchallan?" + qryString, "_blank");
        }} ></i></span>);
        if (status === "CREATED") {
            controls.push(<button className="btn btn-sm btn-outline-primary" onClick={() => this.showClothChallanView(data)}>Edit</button>);
            const approveProps = {
                url: "/service/clothchallan/complete",
                onError: () => { this.TOAST.current.showFailed("Something went wrong", "Unable to approve challan"); },
                onSuccess: this.onApproveSuccess,
                valueGetter: () => ({ id, clientId }),
            };
            controls.push(<PostButton key="approve" size="sm" {...approveProps} needConfirmation confirmMessage="Are you sure to Approve this challan?">Approve</PostButton>);
        } else {
            if (isWithinNdays(utcStringToDate(updatedTime), -7) && status === "COMPLETED") {
                const cancelProps = {
                    url: "/service/clothchallan/cancel",
                    onError: () => { this.TOAST.current.showFailed("Something went wrong", "Unable to cancel challan"); },
                    onSuccess: this.onCancelSuccess,
                    valueGetter: () => ({ id, clientId }),
                };
                controls.push(<PostButton key="cancel" varient="danger" size="sm" {...cancelProps} needConfirmation confirmMessage="Are you sure to cancel this challan?">Cancel</PostButton>);
            }
        }
        return controls;
    }

    render() {
        const { serial, data: { number, challanDate, client: { name } = {}, createdTime, status, totalPayableCost, deduction, finalCost, totalDamageCost } = {} } = this.props;
        return <tr>
            <th>{serial}</th>
            <td>{number}</td>
            <td>{convertToISTDate(challanDate)}</td>
            <td>{name}</td>
            <td>{convertToISTDate(createdTime)}</td>
            <td>{totalPayableCost ? totalPayableCost : "-"}</td>
            <td>{deduction ? deduction : "-"}</td>
            <td>{finalCost ? finalCost : "-"}</td>
            <td>{totalDamageCost ? totalDamageCost : "-"}</td>
            <td>{status}</td>
            <td className="d-flex gap-1">{this.getAction()}</td>
        </tr>
    }
}

