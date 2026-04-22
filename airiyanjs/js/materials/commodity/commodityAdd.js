import React from "react";
import { importASL } from "../../utilities/utilities";
import { SingleTextForm } from "../../common/SingleTextForm";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";

export class CommodityAdd extends React.Component {
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

    onSuccess = (data) => {
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Commodity Added SuccessFully", () => {
                this.props?.refresh();
                this.props?.onClose();
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
        const prop = {
            className: "mx-auto w-100",
            buttonText: "Add",
            placeholder: "Commodity Name",
            url: "/service/commodity/add",
            textValidator: this.textValidator,
            onSuccess: this.onSuccess,
            onError: this.onError,
        }
        return <div className="mt-1">
            <SingleTextForm {...prop} />
        </div>;
    }
}