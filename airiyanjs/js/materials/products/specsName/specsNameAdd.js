import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../../globals/constants";
import { SpecsGroupPicker } from "../specsGroup/specsGroupPicker";

const TitledText = GetAslModules("TitledTextBox")
const PostButton = GetAslModules("PostButton")
export class SpecsNameAdd extends React.Component {
    textRef = React.createRef(null);
    specsGroupRef = React.createRef(null);

    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    textValidator = (data) => {
        if (data === null || data === '' || data.trim() === '' || data.trim() !== data) {
            return false;
        }
        return true;
    }

    valueGetter = () => {
        const { dataModifier } = this.props;
        const name = this.textRef.current?.getValue();
        const specsGroup = this.specsGroupRef.current?.getValue();
        const finalVal = { name, id:specsGroup.id };
        if (dataModifier) {
            return dataModifier(finalVal);
        }
        return finalVal;
    }

    postValidator = () => {
        return this.textRef.current?.isValid();
    }

    onDisabled = (disabled) => {
        this.textRef.current?.setDisabled(disabled);
    }

    onSuccess = (data) => {
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Specs Name Added SuccessFully",()=> {
                this.props?.onClose();
                this.props?.refresh();
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else {
            this.TOAST.current?.showFailed("Unknown Error", message);
        }
    }

    onError = (err) => {
        this.TOAST.current?.showFailed("Error", "Something went wrong");
    }

    render() {
        const { label = "", placeholder = "Specs Name", buttonText = "Add" } = this.props;
        return (
        <div>
            <div className="mb-2 mx-auto">
                <SpecsGroupPicker ref={this.specsGroupRef} />
            </div>
            <div className="input-group">
                {label ? <span className="input-group-text">{label}</span> : ""}
                <TitledText ref={this.textRef} placeholder={placeholder} validator={this.textValidator} />
                <PostButton
                    url="/service/specs_name/add"
                    onDisabled={this.onDisabled}
                    valueGetter={this.valueGetter}
                    validator={this.postValidator}
                    onSuccess={this.onSuccess}
                    onError={this.onError}>
                    {buttonText}
                </PostButton>
            </div>
        </div>)
    }
}