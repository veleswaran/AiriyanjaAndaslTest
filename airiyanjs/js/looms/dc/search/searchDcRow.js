import React from "react";
import { importASL, GetAslModules } from "../../../utilities/utilities";
import { ViewDc } from "../viewDc";
import { convertToIST, isWithinNdays, utcStringToDate } from "../../../utilities/timeUtils";
import { CancelDc } from "./cancelDc";

const PostButton = GetAslModules("PostButton");

export class SearchDcRow extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    showDc = () => {
        const { data = {} } = this.props;
        this.POPUP.current?.showPopUp("View challan", ViewDc, "",
            {
                modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" },
                props: { data }
            });
    }

    printDc = () => {
        const { data: { id } = {} } = this.props;
        window.open("/loom/printdc?dcid=" + id, "_blank");
    }

    onCancel = () => {
        const { data = {} } = this.props;
        const { number, status, type, notes = [], clientDetail = {}, createdTime } = data;
        const { billingName } = clientDetail;
        if (type === 'DELIVERY') {
            this.POPUP.current?.showPopUp("Cancel DC for : " + billingName + " | Dc NO: " + number, CancelDc, "",
                {
                    modalProps: { className: "bg-opacity-75 bg-dark" },
                    props: { data, css: "row gap-1 m-0 p-0", }
                });
        } else {
            this.POPUP.current?.showPopUp("Cancel RC for : " + billingName + " | RC NO: " + number, CancelDc, "",
                {
                    modalProps: { className: "bg-opacity-75 bg-dark" },
                    props: { data, css: "row gap-1 m-0 p-0", url: "/service/dc/return/cancel", type: "Rc" }
                });
        }
    }

    render() {
        const { serial, data = {} } = this.props;
        const { number, status, type, notes = [], clientDetail = {}, createdTime } = data;
        const { billingName } = clientDetail;
        let canCancel = isWithinNdays(utcStringToDate(createdTime), -5) && (status == 'DELIVERED' || status === 'RECEIVED');
        return <tr>
            <td>{serial}</td>
            <td>{number}</td>
            <td>{billingName}</td>
            <td>{convertToIST(createdTime)}</td>
            <td>{status}</td>
            <td>{type}</td>
            <td>{notes}</td>
            <td>
                <button className="btn btn-sm btn-outline-secondary" onClick={this.showDc}>view</button>
                <button className="btn btn-sm btn-outline-secondary ms-1" onClick={this.printDc}>print</button>
                <button className={"btn btn-sm btn-outline-danger ms-1 " + (canCancel ? "" : "visually-hidden")} onClick={this.onCancel}>cancel</button>
            </td>
        </tr>;
    }
}