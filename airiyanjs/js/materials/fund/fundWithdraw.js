import React, { createRef } from "react";
import { importASL } from "../../utilities/utilities";
import { SingleNumericForm } from "../../common/SingleNumericForm";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";

export class FundWithdraw extends React.Component {
    inputRef = createRef();
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    textValidator = (data) => {
        const amount = parseFloat(data);
        return !isNaN(amount) && amount > 0;
    }

    onSuccess = (data) => {
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current?.showSuccess("Success", "Fund Widthdraw SuccessFully");
            this.inputRef.current?.reset();           
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
            buttonText: "withdraw",
            placeholder: "Amount to withdraw",
            url: "/service/fund/widthdraw",
            textValidator: this.textValidator,
            onSuccess: this.onSuccess,
            onError: this.onError,
        }
        return <div className="mt-1">
            <SingleNumericForm {...prop} ref={this.inputRef}/>
        </div>;
    }
}