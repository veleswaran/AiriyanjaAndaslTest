import React from "react";
import { ClientPicker } from "../../../clients/clientPicker";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../../globals/constants";
import { positiveValidator } from "../../../utilities/validators";

const TitledIntegerTextBox = GetAslModules("TitledIntegerTextBox");
const TitledTextBox = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class AddClothChallan extends React.Component {
    clientRef = React.createRef(null);
    challanNumberRef = React.createRef(null);
    dateRef = React.createRef(null);
    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    valueGetter = () => {
        const { clientId } = this.clientRef.current?.getValue();
        const number = this.challanNumberRef.current?.getValue();
        const challanDate = this.dateRef.current?.getValue();
        return { clientId, number, challanDate };
    }

    postValidator = () => {
        const clientValid = this.clientRef.current?.isValid();
        const numberValid = this.challanNumberRef.current?.isValid();
        const dateValid = this.dateRef.current.getValue() ? true : false;
        if (!dateValid) {
            this.TOAST.current?.showWarning("Invalid Date", "Select challan date");
        }
        return clientValid && numberValid && dateValid;
    }

    successFunc = (rdata) => {
        const { onSuccess, onClose } = this.props;
        const { result, message, data } = rdata;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Loomed cloth challan successfully", () => {
                onSuccess?.(data);
                onClose?.();
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
        const { css = "", style = {}, baseUrl = "/service/client", clientType = "PURCHASE", businessData = {} } = this.props;
        return (
            <div className={css} style={style}>
                <ClientPicker ref={this.clientRef} url={`${baseUrl}/${clientType}/search`} baseUrl={baseUrl} clientType={clientType} businessData={businessData} />
                <TitledIntegerTextBox placeholder="Number" ref={this.challanNumberRef} validator={positiveValidator} />
                <TitledTextBox ref={this.dateRef} placeholder="Date" type="date" class="mt-1" />
                <div className="mt-1 text-end">
                    <PostButton url="/service/clothchallan/add" valueGetter={this.valueGetter}
                        validator={this.postValidator} onSuccess={this.successFunc} onError={this.onError}>
                        Add
                    </PostButton>
                </div>
            </div>
        );
    }
}