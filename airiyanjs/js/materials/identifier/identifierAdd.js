import React from "react";
import { importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { Identifierform } from "./Identifierform";

export class IdentifierAdd extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    textValidator = (vl) => {
        if (vl === null || vl === "" || vl.trim() === "" || vl.trim() !== vl) {
            return false;
        }
        return true;
    };

    dataConstructor = (data) => {
        const { name } = data;
        const dataType = this.datatypeRef?.getValue();
        return { name, dataType };
    };

    onSuccess = (response) => {
        const { result, data, message = "" } = response;

        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Identifier Added Successfully", () => location.reload());
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", "Identifier Already Exist");
        } else {
            this.TOAST.current?.showFailed("Error", "Some Error happened");
        }
    };

    onError = () => {
        this.TOAST.current?.showFailed("Error", "Something went wrong");
    };

    render() {
        const prop = {
            placeholder: "Enter Identifier Name",
            url: "/service/identifier/add",
            textValidator: this.textValidator,
            dataConstructor: this.dataConstructor,
            onSuccess: this.onSuccess,
            onError: this.onError,
            buttonText: "Add"
        };

        return (
            <div>
                <Identifierform {...prop} />
            </div>
        );
    }
}
