import React from "react";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { SpecsMultiSelecter } from "../../materials/products/specsName/specsMultiSelecter";
import { ClientPicker } from "../../clients/clientPicker";
import { RESULT_INVALID, RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";

const TitledTextBox = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class AddClientLoom extends React.Component {
    clientRef = React.createRef(null);
    numberRef = React.createRef(null);
    specsRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getValue = () => {
        const clientDetails = this.clientRef.current?.getValue();
        const number = this.numberRef.current?.getValue() || "";
        const specsDetails = this.specsRef.current?.getValue() || [];
        const specs = [];
        for (const spd of specsDetails) {
            const { id } = spd;
            specs.push(id);
        }
        const { clientId } = clientDetails;
        return { number, specs, clientId };
    }

    validator = () => {
        const clientDetails = this.clientRef.current?.getValue();
        const number = this.numberRef.current?.getValue() || "";
        if (!clientDetails) {
            this.TOAST.current?.showWarning("Client Not selected", "Please select client");
            return false;
        }
        if (!number || number === "") {
            this.TOAST.current?.showWarning("Invalid loom number", "Please enter loom number");
            return false;
        }
        return true;
    }

    onSuccess = (data) => {
        const { onSuccess, onClose } = this.props;
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Loom added to client", () => {
                if (onSuccess) {
                    onSuccess();
                }
                if (onClose) {
                    onClose();
                }
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else if (result === RESULT_INVALID) {
            this.TOAST.current?.showMessage("Invalid", message);
        } else {
            this.TOAST.current?.showFailed("Unknown Error", message || "Something went wrong");
        }
    }

    onError = (err) => {
        this.TOAST.current?.showFailed("Error", "Something went wrong");
    }

    render() {
        const { baseUrl = "/service/client", clientType = "PURCHASE", businessData = {} } = this.props;
        return <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <ClientPicker ref={this.clientRef} url={`${baseUrl}/${clientType}/search`} baseUrl={baseUrl} clientType={clientType} businessData={businessData} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TitledTextBox ref={this.numberRef} placeholder="Loom Number" />
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col">
                        <SpecsMultiSelecter ref={this.specsRef} title="select loom specs" />
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col text-end">
                        <PostButton url="/service/client_loom/add" valueGetter={this.getValue} validator={this.validator}
                            onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add" />
                    </div>
                </div>
            </div>
        </div>
    }
}

export class AddClientLoomBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onClick = () => {
        this.POPUP.current.showPopUp("Add new client loom", AddClientLoom, 'bg-warning',
            {
                modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark" },
                props: {}
            });
    }

    render() {
        return <div>
            <button className="btn btn-primary" onClick={this.onClick}>Add Client loom</button>
        </div>;
    }
}