import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../globals/constants";
import { uuidv4 } from "../../../utilities/uuidv4";

const EditBox = GetAslModules("EditBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");

export class LowStockSetter extends React.Component {
    editRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = { upid: uuidv4() };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }


    onSuccess = (rData) => {
        const { result, message } = rData;
        if (result === RESULT_SUCCESS) {
            const { data = {} } = this.props;
            const numeric = this.editRef.current?.getValue();
            data.price = numeric;
            this.editRef.current.setValue(numeric);
            this.editRef.current.onCancel();
            this.setState({ upid: uuidv4() });
            this.TOAST.current?.showSuccess("Success", "minimum required stock edited Sucessfully");
        } else {
            this.TOAST.current?.showFailed("Unable to edit", message || "Unknown error");
        }
    }

    editGetVal = () => {
        const { data: { id } = {} } = this.props;
        const numeric = this.editRef.current?.getValue();
        return { id, numeric };
    }

    render() {
        const { data = {} } = this.props;
        const { minimumStock } = data;
        const textInputProps = {
            placeholder: "price",
            positiveOnly: true,
        };
        const postProps = {
            url: "/service/product/update/lowstock",
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to set lock stock limit"); },
            onSuccess: this.onSuccess,
            valueGetter: this.editGetVal
        };
        return <div style={{ maxWidth: "150px" }}><EditBox ref={this.editRef} value={minimumStock} css="input-group-sm" label={""} textInput={TitledDecimalTextBox} textInputProps={textInputProps} postProps={postProps} /></div>;
    }
}