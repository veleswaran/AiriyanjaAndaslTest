import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { stringNotNullOrEmpty } from "../../../utilities/validators";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../../globals/constants";

const TitledTextBox = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class CommodityEdit extends React.Component {
    textRef = React.createRef(null);
    constructor(props) {
        super(props)

    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    getFormData = () => {
        const { data } = this.props
        const { id } = data || {}
        const name = this.textRef.current?.getValue();
        return { id, name };
    }

    validator = () => {
        return this.textRef.current?.isValid();
    }

    onSuccess = (d) => {
        const { result, message, data } = d;
        const { onSuccess, onClose } = this.props
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Commodity Updated Successfully", () => {
                onSuccess?.(data);
                onClose?.();
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else {
            this.TOAST.current?.showFailed("Error", message || "Unable to save commodity");
        }
    }

    onError = (e) => {
        this.TOAST.current?.showFailed("Error", "Unable to save commodity");
    }

    nameValidator = (data) => {
        return stringNotNullOrEmpty(data) ? data.length <= 150 : false;
    }

    render() {
        const { data = {} } = this.props;
        const { name = "" } = data;
        return <div>
            <TitledTextBox ref={this.textRef} placeholder="Commodity Name" value={name} validator={this.nameValidator} />
            <div className="mt-1 text-end">
                <PostButton url="/service/commodity/updatename" valueGetter={this.getFormData} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} >Update</PostButton>
            </div>
        </div>;
    }
}