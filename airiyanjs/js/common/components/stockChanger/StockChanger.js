import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { uuidv4 } from "../../../utilities/uuidv4";
import { RESULT_SUCCESS } from "../../../globals/constants";

const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const TitledTextArea = GetAslModules("TitledTextArea");
const PostButton = GetAslModules("PostButton");

export class StockChanger extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onSuccess = (newData) => {
        const { onSuccess, data = {} } = this.props;
        if (onSuccess) {
            onSuccess(newData, data);
        }
        this.setState({ uid: uuidv4() });
    }

    onAddClick = () => {
        const { increment = {}, unitName = "", data } = this.props;
        const { url = "", buttonText = "Add Stock", title = "Adding Stock", postConstructor } = increment;
        this.POPUP.current?.showPopUp(title, StockForm, "", { props: { onSuccess: this.onSuccess, postConstructor, data, unitName, url, buttonText } });
    }

    onReduceClick = () => {
        const { decrement = {}, unitName = "", data } = this.props;
        const { url = "", buttonText = "Reduce Stock", title = "Reduce Stock", postConstructor } = decrement;
        this.POPUP.current?.showPopUp(title, StockForm, "", { props: { onSuccess: this.onSuccess, postConstructor, data, unitName, url, buttonText } });
    }

    render() {
        const { data = {}, needEdit = false, processLabel } = this.props;
        let label = "";
        if (processLabel) {
            label = processLabel(data);
        }
        if (needEdit) {
            return <div className="input-group input-group-sm" style={{ "width": "max-content" }}>
                <button className="btn btn-sm bi bi-plus btn-outline-success" onClick={this.onAddClick}></button>
                <span className="input-group-text">{label}</span>
                <button className="btn btn-sm bi bi-dash btn-outline-danger" onClick={this.onReduceClick}></button>
            </div>

        }
        return <span>{label}</span>
    }

}



class StockForm extends React.Component {
    stockRef = React.createRef(null);
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

    valueValidator = (value) => {
        if (value <= 0) {
            return false;
        }
        return true;
    }

    validator = () => {
        return this.stockRef.current?.isValid() && this.notesRef.current?.isValid();
    }

    getValue = () => {
        const { id, postConstructor, data = {} } = this.props;
        const numeric = this.stockRef.current.getValue();
        const string = this.notesRef.current.getValue();
        const postValue = postConstructor ? postConstructor(data, { numeric, string }) : { numeric, string };
        return postValue;
    }

    onSuccess = (rData) => {
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current.showSuccess("Success", "Stock updated successfully");
            const { onSuccess, onClose } = this.props;
            if (onSuccess) {
                onSuccess(data)
            }
            if (onClose) {
                onClose();
            }
        } else {
            this.TOAST.current?.showFailed("Unable Update stock", message || "Unknown error");
        }
    }


    onError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to update stock value");
    }

    render() {
        const { unitName, url, buttonText = "" } = this.props;
        return <div>
            <TitledDecimalTextBox ref={this.stockRef} placeholder={unitName} positiveOnly={true} validator={this.valueValidator} />
            <TitledTextArea ref={this.notesRef} placeholder="Notes" validator={this.notesvalidator} />
            <div className="text-end mt-1">
                <PostButton url={url} valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text={buttonText} needConfirmation={true} confirmMessage={"Do you want to perform " + buttonText}
                />
            </div>
        </div>
    }
}

