import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS } from "../../globals/constants";

const TitledSelect = GetAslModules("TitledSelect");
const TitledTextBox = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class EwayCancel extends React.Component {
    reasonRef = React.createRef();
    remarkRef = React.createRef();
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }
    getValue = () => {
        const reason = this.reasonRef.current?.getValue()
        const remark = this.remarkRef.current?.getValue();
        const { billId } = this.props;
        return { billId, reason, remark };
    }

    validator = () => {
        if (!this.reasonRef.current?.isValid()) {
            return false;
        }
        if (!this.remarkRef.current?.isValid()) {
            return false;
        }
        return true;
    }

    onSuccess = (rData) => {
        const { onSuccess, onClose } = this.props;
        const { result, message } = rData;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current?.showSuccess("Success", "E-Way Bill cancelled successfully");
            onSuccess?.();
            onClose?.();
        } else {
            this.TOAST.current?.showFailed("Unable to cancel E-Way Bill", message || "Unknown error");
        }
    }

    onError = (err) => {
        this.TOAST.current.showFailed("Something went wrong", "Unable to cancel E-Way Bill try again later");
    }

    render() {
        const { css = "", style = {},category } = this.props;
        const options = [{ label: "Duplicate", value: "DUPLICATE" },
        { label: "Order Cancelled", value: "ORDER_CANCELLED" },
        { label: "Data Entry Mistake", value: "DATA_ENTRY_MISTAKE" },
        { label: "Others", value: "OTHERS" }];
        return <div className={css} style={style}>
            <div>
                <TitledSelect ref={this.reasonRef} placeholder="Reason" isstringlist={false} options={options} />
            </div>
            <div className="mt-1">
                <TitledTextBox ref={this.remarkRef} placeholder="Remark" type="text" validator={remarkValidator} />
            </div>
            <div className="mt-1">
                <PostButton url={`/service/billeway/${category}/cancelewaybill`} valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Cancel E-Way Bill" />
            </div>
        </div>;
    }

}


function remarkValidator(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 2 || data.length > 50) {
        return false;
    }
    return true;
}
