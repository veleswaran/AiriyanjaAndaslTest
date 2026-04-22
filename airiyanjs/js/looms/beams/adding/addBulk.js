import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { AddBulkRow } from "./addBulkRow";
import { RESULT_SUCCESS } from "../../../globals/constants";

const TitledTextBox = GetAslModules("TitledTextBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const TitledIntegerTextBox = GetAslModules("TitledIntegerTextBox");
const MultiRender = GetAslModules("MultiRender");
const PostButton = GetAslModules("PostButton");

export class AddBulk extends React.Component {
    startNumberRef = React.createRef(null);
    endNumberRef = React.createRef(null);
    lengthRef = React.createRef(null);
    widthRef = React.createRef(null);
    threadCountRef = React.createRef(null);
    beamListRef = React.createRef(null);
    constructor(props) {
        super(props)
        const { group = {} } = props;
        this.state = { group };
    }

    zeroValidator = (data) => {
        if (data === null || data <= 0) {
            return false;
        }
        return true;
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    isValid = () => {
        return this.lengthRef.current.isValid() && this.widthRef.current.isValid() && this.threadCountRef.current.isValid()
            && this.startNumberRef.current.isValid() && this.endNumberRef.current.isValid()
    }


    generateBeams = () => {
        const { group = {} } = this.state;
        if (this.isValid()) {
            const length = this.lengthRef.current.getValue();
            const width = this.widthRef.current.getValue();
            const threadCount = this.threadCountRef.current.getValue();
            const startNumber = this.startNumberRef.current.getValue();
            const endNumber = this.endNumberRef.current.getValue();
            if (endNumber > 150) {
                this.TOAST.current.showWarning("Improper number", "Number of beam cannot exceed 150");
            } else {
                this.beamListRef.current.clear();
                for (let index = startNumber; index < Number(startNumber) + Number(endNumber); index++) {
                    this.beamListRef.current.add({ props: { data: { length, width, threadCount, number: index, group } } });
                }
            }
        } else {
            this.TOAST.current.showWarning("Value missing", "Please fill all values");
        }
    }

    getValue = () => {
        return this.beamListRef.current.getValue();
    }

    dataValidator = () => {
        if (this.beamListRef.current.getValue().length <= 0) {
            this.TOAST.current?.showWarning("Invalid List", "Please generate beam list");
            return false;
        }
        if (!this.beamListRef.current.isValid()) {
            this.TOAST.current?.showWarning("Invalid", "Some invalid detail found");
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
            this.POPUP.current?.showSuccess("Success", "Beams added successfully", () => {
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
                    <TitledDecimalTextBox ref={this.lengthRef} placeholder="Length (Metre)" positiveOnly={true} validator={this.zeroValidator} />
                </div>
                <div className="col">
                    <TitledDecimalTextBox ref={this.widthRef} placeholder="width (Metre)" positiveOnly={true} validator={this.zeroValidator} />
                </div>
                <div className="col">
                    <TitledIntegerTextBox ref={this.threadCountRef} placeholder="Number of thread" positiveOnly={true} validator={this.zeroValidator} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <TitledIntegerTextBox ref={this.startNumberRef} placeholder="Starting beam Number" positiveOnly={true} validator={this.zeroValidator} />
                </div>
                <div className="col">
                    <TitledIntegerTextBox ref={this.endNumberRef} placeholder="Number of beams" positiveOnly={true} validator={this.zeroValidator} />
                </div>
                <div className="col text-end align-content-center">
                    <button className="btn btn-secondary" onClick={this.generateBeams}>Generate beam</button>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col">
                    <MultiRender ref={this.beamListRef} component={AddBulkRow} />
                </div>
            </div>
            <div className="row">
                <div className="col align-content-center text-end">
                    <PostButton url="/service/beam/addbulk" valueGetter={this.getValue} validator={this.dataValidator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add Beams" />
                </div>
            </div>
        </div>;
    }
}