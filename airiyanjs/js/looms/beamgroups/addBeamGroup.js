import React from "react";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { SpecsMultiSelecter } from "../../materials/products/specsName/specsMultiSelecter";


const TitledTextBox = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class AddBeamGroup extends React.Component {
    textRef = React.createRef(null);
    specsRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    getValue = () => {
        const values = this.specsRef.current?.getValue();
        const name = this.textRef.current?.getValue() || "";
        const specs = values.map(item => Number(item.id));
        return { specs, name };
    }

    validator = () => {
        const values = this.specsRef.current?.getValue();
        const name = this.textRef.current?.getValue() || "";
        if (values.length === 0) {
            this.TOAST.current?.showWarning("Specs not selected", "Please select at least one specs to add beam group");
            return false;
        }
        if (name.trim() === "") {
            this.TOAST.current?.showWarning("Invalid Name", "Name cannot be empty");
            return false;
        }
        return true;
    }

    textValidator = (data) => {
        if (data === null || data === '' || data.trim() === '' || data.trim() !== data) {
            return false;
        }
        return true;
    }

    onSuccess = (data) => {
        const { onSuccess, onClose } = this.props;
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Beam group added SuccessFully", () => {
                if (onSuccess) {
                    onSuccess();
                }
                if (onClose) {
                    onClose();
                }
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else {
            this.TOAST.current?.showFailed("Unknown Error", message || "Something went wrong");
        }
    }

    onError = (err) => {
        this.TOAST.current?.showFailed("Error", "Something went wrong");
    }

    render() {
        return <div className="row gap-1">
            <div>
                <TitledTextBox ref={this.textRef} placeholder="Group Name" validator={this.textValidator} />
            </div>
            <div>
                <SpecsMultiSelecter ref={this.specsRef} title="Select Beam group specs" />
            </div>
            <div className="text-end">
                <PostButton url="/service/beamgroup/add" valueGetter={this.getValue} validator={this.validator}
                    onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add" />
            </div>
        </div>;
    }
}