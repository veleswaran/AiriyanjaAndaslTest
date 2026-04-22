import React from "react";
import { importASL, GetAslModules } from "../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../globals/constants";
import { uuidv4 } from "../../../utilities/uuidv4";

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

    onSuccess = (product) => {
        const { stock } = product;
        const { data = {} } = this.props;
        data.stock = stock;
        this.setState({ uid: uuidv4() });
    }

    onAddClick = () => {
        const { data = {} } = this.props;
        const { id, localId, unit: { name: unitName } = {} } = data;
        this.POPUP.current?.showPopUp("Add Stock for PID " + localId, StockForm, "", { props: { onSuccess: this.onSuccess, id, unitName, url: "/service/product/stock/add", bText: "Add Stock" } });
    }

    onReduceClick = () => {
        const { data = {} } = this.props;
        const { id, localId, unit: { name: unitName } = {} } = data;
        this.POPUP.current?.showPopUp("Reduce Stock for PID " + localId, StockForm, "", { props: { onSuccess: this.onSuccess, id, unitName, url: "/service/product/stock/reduce", bText: "Reduce Stock" } });
    }

    render() {
        const { data = {}, needEdit = false } = this.props;
        const { type, stock, unit: { name: unitName } = {} } = data;
        if (type !== "STOCKED") {
            return "-"
        }
        if (needEdit) {
            return <div className="input-group input-group-sm" style={{ "width": "max-content" }}>
                <button className="btn btn-sm bi bi-plus btn-outline-success" onClick={this.onAddClick}></button>
                <span className="input-group-text">{stock + " " + unitName}</span>
                <button className="btn btn-sm bi bi-dash btn-outline-danger" onClick={this.onReduceClick}></button>
            </div>

        }
        return <span>{stock + " " + unitName}</span>
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
        const { id } = this.props;
        const numeric = this.stockRef.current.getValue();
        const string = this.notesRef.current.getValue();
        return { id, numeric, string };
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
        const { unitName, url, bText = "" } = this.props;
        return <div>
            <TitledDecimalTextBox ref={this.stockRef} placeholder={unitName} positiveOnly={true} validator={this.valueValidator} />
            <TitledTextArea ref={this.notesRef} placeholder="Notes" validator={this.notesvalidator} />
            <div className="text-end mt-1">
                <PostButton url={url} valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text={bText} needConfirmation={true} confirmMessage={"Do you want to perform " + bText}
                />
            </div>
        </div>
    }
}

