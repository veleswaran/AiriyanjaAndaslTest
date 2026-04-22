
import React, { Component, createRef } from "react";
import { RESULT_INVALID, RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { emailValidatorSimple, indianGSTINValidator,  mobileValidator } from "../../utilities/validators";
import { GetAslModules, importASL } from "../../utilities/utilities";

const TitledTextBox = GetAslModules("TitledTextBox");
const TitledTextArea = GetAslModules("TitledTextArea");
const PostButton = GetAslModules("PostButton");
const DynamicInputs = GetAslModules("DynamicInputs")

export class AddGstClient extends Component {
    phoneRef = createRef();
    noteRef = createRef();
    additionalRef = createRef();
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getFormData = () => {
        const { clientId = 0 } = this.props;
        const additionalData = this.additionalRef?.current?.getValue();
        const formData = {
            mobile: this.phoneRef.current?.getValue(),
            notes: this.noteRef.current?.getValue(),
            clientId
        };
        if (additionalData && additionalData instanceof Map && additionalData.size > 0) {
            additionalData.forEach((values, key) => {
                const fieldName = key.toLowerCase();
                formData[fieldName] = values.length > 0 ? values[0] : "";
            });
        }
        return formData;
    }

    validator = () => {
        let res = true;
        const refs = [this.phoneRef, this.additionalRef];
        for (const rf of refs) {
            if (rf.current && !rf.current?.isValid()) {
                res = false;
            }
        }
        return res;
    }

    onSuccess = (d) => {
        const { result, message, data = {}, invalids = {} } = d;
        const { onSuccess, onClose } = this.props
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Client Added Successfully", () => {
                onSuccess?.(data);
                onClose?.();
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else {
            if (!this.setInvalids(invalids)) {
                this.TOAST.current?.showFailed("Error", message || "Unable to add client");
            }
        }
    }

    onError = (e) => {
        const { body = null } = e;
        let messageDisplayed = false;
        if (body !== null) {
            const { invalids = {} } = body;
            messageDisplayed = this.setInvalids(invalids);
        }
        if (!messageDisplayed) {
            this.TOAST.current?.showFailed("Error", "Something went wrong. Unable to add client");
        }
    }

    setInvalids = (invalids) => {
        let messageDisplayed = false;
        Object.keys(invalids).forEach((key) => {
            const val = invalids[key];
            switch (key) {
                case "mobile":
                    this.phoneRef.current.setValid(false);
                    break;
                case "gst":
                    this.additionalRef.current.setValid("GST", false);
                    break;
                case "email":
                    this.additionalRef.current.setValid("Email", false);
                    break;
            }
            this.TOAST.current?.showWarning("Invalid Fields", val);
            messageDisplayed = true;
        });
        return messageDisplayed;
    }

    render() {
        const { url, buttonTitle = "Add", gstMandatory = false } = this.props;
        return (<>
            <TitledTextBox ref={this.phoneRef} placeholder="Mobile Number" validator={mobileValidator} class=" mt-1" />
            <TitledTextArea ref={this.noteRef} placeholder="Notes" />
            <div className="d-flex justify-content-center mt-1">
                <DynamicInputs ref={this.additionalRef} name="Add More Details" inputs={[
                    { name: "Email", isUnique: true, component: TitledTextBox, props: { placeholder: "Email", validator: emailValidatorSimple } },
                    { name: "GST", isUnique: true, isMandatory: gstMandatory, component: TitledTextBox, props: { placeholder: "GST Number", validator: indianGSTINValidator } }]} style="card p-1 w-75" />
            </div>
            <div className="text-end">
                <PostButton url={url} valueGetter={this.getFormData} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text={buttonTitle} />
            </div>
        </>);
    }
}
