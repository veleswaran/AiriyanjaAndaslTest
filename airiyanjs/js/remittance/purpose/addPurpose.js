import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { percentageValidator } from "../../utilities/validators";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";

const TitledText = GetAslModules("TitledTextBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const DynamicInputs = GetAslModules("DynamicInputs");
const PostButton = GetAslModules("PostButton");

export class AddPurpose extends React.Component {
    nameRef = React.createRef(null);
    deductionRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    nameValidator = (data) => {
        if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 2 || data.length > 100) {
            return false;
        }
        return true;
    }

    getFormData = () => {
        const name = this.nameRef.current.getValue();
        const deductionsMap = this.deductionRef.current.getValue();
        const deductions = [];
        deductionsMap.forEach((value, key) => {
            if (value.length > 0) {
                deductions.push({ name: key, percentage: value[0] });
            }
        });
        return { name, deductions };
    }

    validator = () => {
        let res = true;
        const refs = [this.nameRef, this.deductionRef];
        for (const rf of refs) {
            if (rf.current && !rf.current?.isValid()) {
                res = false;
            }
        }
        return res;
    }

    onSuccess = (d) => {
        const { result, message } = d;
        const { onSuccess, onClose } = this.props
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Purpose Added Successfully", () => {
                onSuccess?.();
                onClose?.();
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else {
            this.TOAST.current?.showFailed("Error", message || "Unable to save purpose");
        }
    }

    onError = (e) => {
        this.TOAST.current?.showFailed("Error", "Unable to save purpose");
    }

    render() {
        const deductionInputs = [
            { name: "TDS", isUnique: true, component: TitledDecimalTextBox, props: { placeholder: "Tds", validator: percentageValidator } }
        ]
        return <div>
            <TitledText ref={this.nameRef} placeholder="Name" validator={this.nameValidator} />
            <DynamicInputs ref={this.deductionRef} name="Add Deductions" inputs={deductionInputs} style="card p-1 mt-2 w-75 mx-auto" />
            <div className="text-end mt-1">
                <PostButton url="/service/purpose/add" valueGetter={this.getFormData} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add" />
            </div>
        </div>
    }
}