import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { SpecsMultiSelecter } from "../../materials/products/specsName/specsMultiSelecter";
import { RESULT_SUCCESS } from "../../globals/constants";

const PostButton = GetAslModules("PostButton");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");

export class AddWeft extends React.Component {
    weftSpecsRef = React.createRef(null);
    stockRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onDisabled = (disabled) => {
        // this.stockRef.current?.setDisabled(disabled);
        this.weftSpecsRef.current?.setDisabled(disabled);
    }
    getValue = () => {
        const values = this.weftSpecsRef.current?.getValue();
        const stock = this.stockRef.current?.getValue() || 0;
        const specs = values.map(item => Number(item.id));
        return { specs, stock };
    }

    validator = () => {
        const values = this.weftSpecsRef.current?.getValue();
        const stock = this.stockRef.current?.getValue() || 0;
        if (!values || values.length === 0) {
            this.TOAST.current?.showWarning("Specs not selected", "Please select at least one specs to add weft");
            return false;
        }
        if (stock <= 0) {
            this.TOAST.current?.showWarning("Invalid stock", "Stock should be greater than zero");
            return false;
        }
        return true;
    }

    onSuccess = (rData) => {
        const { onSuccess, onClose } = this.props;
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Weft added successbully", () => {
                // window.location.reload();
                if (onSuccess) {
                    onSuccess(data);
                }
                if (onClose) {
                    onClose();
                }
            });
        } else {
            this.TOAST.current?.showFailed("Unable to add weft", message || "Unknown error");
        }
    }

    onError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to add now. please try again later");
    }


    render() {
        return [
            <div className="row">
                <div className="col-3 align-content-center">
                    Stock
                </div>
                <div className="col text-end p-0">
                    <TitledDecimalTextBox ref={this.stockRef} positiveOnly={true} placeholder="Initial Stock in (Kg)" css="m-0" value={0} />
                </div>
            </div>,
            <div className="row mt-1">
                <SpecsMultiSelecter ref={this.weftSpecsRef} title="Select weft Specs" css="p-0" />
            </div>,
            <div className="row">
                <div className="col text-end mt-1 p-0">
                    <PostButton url="/service/weft/add" valueGetter={this.getValue} validator={this.validator}
                        onSuccess={this.onSuccess} onError={this.onError} onDisabled={this.onDisabled} variant="primary" text="Add Weft" />
                </div>
            </div>
        ];
    }
}
