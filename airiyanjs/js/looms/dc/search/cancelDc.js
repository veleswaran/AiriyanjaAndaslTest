import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../globals/constants";

const TitledTextArea = GetAslModules("TitledTextArea");
const PostButton = GetAslModules("PostButton");

export class CancelDc extends React.Component {
    notesRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    notesvalidator = (value) => {
        if (value === null || value === "" || value.trim() === "") {
            return false;
        }
        return true;
    }

    getValue = () => {
        const { data = {} } = this.props;
        const { id } = data;
        const notes = this.notesRef.current.getValue();
        return { id, notes };
    }

    validator = () => {
        return this.notesRef.current?.isValid();
    }

    onSuccess = (rData) => {
        const { type = "dc" } = this.props;
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current.showSuccess("Success", type + " Cancelled sucessfully");
            const { onSuccess, onClose } = this.props;
            if (onSuccess) {
                onSuccess(data)
            }
            if (onClose) {
                onClose();
            }
        } else {
            this.TOAST.current?.showFailed("Unable Update " + type, message || "Unknown error");
        }
    }

    onError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to cancel " + type);
    }


    render() {
        const { css = "", url = "/service/dc/delivery/cancel" } = this.props;
        return <div className={css}>
            <div className="row p-0 m-0">
                <div className="col">
                    <TitledTextArea ref={this.notesRef} placeholder="Cancel Reason" validator={this.notesvalidator} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col text-end">
                    <PostButton url={url} valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} css="btn btn-danger" varient="" text="cancel" />
                </div>
            </div>
        </div>
    }
}
