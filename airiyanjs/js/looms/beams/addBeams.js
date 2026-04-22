import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS } from "../../globals/constants";

const TitledTextBox = GetAslModules("TitledTextBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const TitledIntegerTextBox = GetAslModules("TitledIntegerTextBox");
const PostButton = GetAslModules("PostButton");

export class AddBeams extends React.Component {
    numberRef = React.createRef(null);
    lengthRef = React.createRef(null);
    widthRef = React.createRef(null);
    threadCountRef = React.createRef(null);
    constructor(props) {
        super(props)
        const { group = {} } = props;
        this.state = { group };
    }

    setGroup = (group) => {
        this.setState({ group });
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getValue = () => {
        const { group = {} } = this.state;
        const { id, autoId } = group;
        const number = this.numberRef.current?.getValue() || "";
        const length = this.lengthRef.current?.getValue() || 0;
        const width = this.widthRef.current?.getValue() || 0;
        const threadCount = this.threadCountRef.current?.getValue() || 0;
        return { beamGroupId: id, number, length, width, threadCount };
    }

    validator = () => {
        const { group = {} } = this.state;
        const { autoId = false } = group;
        const number = this.numberRef.current?.getValue() || "";
        const length = this.lengthRef.current?.getValue() || 0;
        const width = this.widthRef.current?.getValue() || 0;
        const threadCount = this.threadCountRef.current?.getValue() || 0;
        if (!autoId && number.trim() === "") {
            this.TOAST.current?.showWarning("Invalid Number", "Number cannot be empty");
            return false;
        }
        if (length <= 0) {
            this.TOAST.current?.showWarning("Invalid Length", "Length should be greater than zero");
            return false;
        }
        if (width <= 0) {
            this.TOAST.current?.showWarning("Invalid Width", "Width should be greater than zero");
            return false;
        }
        if (threadCount <= 0) {
            this.TOAST.current?.showWarning("Invalid Number of Thread", "Number of thread should be greater than zero");
            return false;
        }
        return true;
    }

    onSuccess = (rData) => {
        const { onSuccess, onClose } = this.props;
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            if (onSuccess) {
                onSuccess(data);
            }
            if (onClose) {
                onClose();
            }
            this.POPUP.current?.showSuccess("Success", "Beam added successfully", () => {
            });
        } else {
            this.TOAST.current?.showFailed("Unable to add it", message || "Unknown error");
        }
    }

    onError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to add beam try again later");
    }

    render() {
        return <div className="row gap-1">
            <div className="row">
                <div className="col">
                    <TitledTextBox ref={this.numberRef} placeholder="Number" positiveOnly={true} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <TitledDecimalTextBox ref={this.lengthRef} placeholder="Length (Metre)" positiveOnly={true} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <TitledDecimalTextBox ref={this.widthRef} placeholder="width (Metre)" positiveOnly={true} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <TitledIntegerTextBox ref={this.threadCountRef} placeholder="Number of thread" positiveOnly={true} />
                </div>
            </div>
            <div className="row">
                <div className="col align-content-center text-end">
                    <PostButton url="/service/beam/add" valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add Beam" />
                </div>
            </div>
        </div>;
    }
}