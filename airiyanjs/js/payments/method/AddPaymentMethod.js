import React from "react";
import { importASL } from "../../utilities/utilities";
import { SingleTextForm } from "../../common/SingleTextForm";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";

export class AddPaymentMethod extends React.Component {
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
            this.POPUP.current?.showSuccess("Success", "Payment type Added SuccessFully", () => {
                window.location.reload();
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
            className: "mx-auto",
            buttonText: "Add Payment Type",
            placeholder: "Payment Type Name",
            url: "/service/paymenttype/add",
            textValidator: this.textValidator,
            onSuccess: this.onSuccess,
            onError: this.onError,
        }
        return <div className="mt-1">
            <SingleTextForm {...prop} />
        </div>;
    }
}