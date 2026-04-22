import React from "react";
import { isWithinNdays, utcStringToDate } from "../../../utilities/timeUtils";
import { CommodityEdit } from "../edit/commodityEdit";
import { importASL } from "../../../utilities/utilities";


export class CommodityRow extends React.Component {
    constructor(props) {
        super(props);
        const { data } = props;
        this.state = { data };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    actionRendered = () => {
        const { others: { onSelect, onClose, isPopUp = false } = {} } = this.props;
        const { data } = this.state;
        if (isPopUp) {
            return <button className="btn btn-primary" onClick={() => {
                onSelect?.(data); onClose?.();
            }}>select</button>
        }
        return "";
    }

    onEditSuccess = (data) => {
        this.setState({ data });
    }


    showEditPopup = () => {
        const { data } = this.state;
        const { name } = data;
        this.POPUP.current.showPopUp("Update Commodity: " + name, CommodityEdit, "bg-warning", { modalProps: { size: 'md', className: "bg-opacity-75 bg-dark", css: { body: "p-1", footer: "visually-hidden" } }, props: { data, onSuccess: this.onEditSuccess } });
    }

    getName = () => {
        const { data } = this.state;
        const { name, createdTime = "" } = data;
        const { others: { isPopUp = false } = {} } = this.props;
        if (!isPopUp && isWithinNdays(utcStringToDate(createdTime), -5)) {
            return <>{name}
                <span className="btn btn-sm btn-outline-dark bi bi-pencil ms-1" onClick={this.showEditPopup}></span>
            </>;
        }
        return name;
    }


    render() {
        const { serial } = this.props;
        return <tr><td>{serial}</td><td>{this.getName()}</td><td>{this.actionRendered()}</td></tr>;
    }
}