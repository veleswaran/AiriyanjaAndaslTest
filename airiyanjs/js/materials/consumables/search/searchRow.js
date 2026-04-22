import React from "react";
import { uuidv4 } from "../../../utilities/uuidv4";
import { getProductName } from "../../products/utilities";
import { GetAslModules, importASL } from "../../../utilities/utilities";

const PostButton = GetAslModules("PostButton");
const EditBox = GetAslModules("EditBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");

export class SearchRow extends React.Component {
    editRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = { uuid: uuidv4(), upid: uuidv4() };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onConsumeEditSuc = (rData) => {
        const { result, message } = rData;
        if (result === RESULT_SUCCESS) {
            const { data = {} } = this.props;
            const numeric = this.editRef.current?.getValue();
            data.consume = numeric;
            this.editRef.current.setValue(numeric);
            this.editRef.current.onCancel();
            this.setState({ upid: uuidv4() });
            this.TOAST.current?.showSuccess("Success", "Edited Sucessfully");
        } else {
            this.TOAST.current?.showFailed("Unable edit", message || "Unknown error");
        }
    }

    editGetVal = () => {
        const { data: { id } = {} } = this.props;
        const numeric = this.editRef.current?.getValue();
        return { id, numeric };
    }

    editValidator = () => {
        const numeric = this.editRef.current?.getValue();
        if (!numeric || numeric <= 0) {
            this.TOAST.current?.showWarning("invalid value", "Consume value is invalid");
            return false;
        }
        return true;
    }

    getConsumeEdit = () => {
        const { data: { consumable = {}, consume } = {}, others = {} } = this.props;
        const { showEdit = false } = others;
        const { unit: { name } } = consumable
        if (showEdit) {
            const textInputProps = {
                placeholder: name,
                positiveOnly: true
            };
            const postProps = {
                url: "/service/consumable/change_consume",
                onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to edit consume value"); },
                onSuccess: this.onConsumeEditSuc,
                valueGetter: this.editGetVal,
                validator: this.editValidator
            };
            return <EditBox ref={this.editRef} value={consume} label={name} textInput={TitledDecimalTextBox} textInputProps={textInputProps} postProps={postProps} />
        }
        return consume + " " + name;
    }

    onEnabSuccess = (rData) => {
        const { result, message } = rData;
        if (result === RESULT_SUCCESS) {
            const { data = {} } = this.props;
            data.enabled = !data.enabled;
            this.setState({ upid: uuidv4() });
            this.TOAST.current?.showSuccess("Success", "State changed successfully");
        } else {
            this.TOAST.current?.showFailed("Unable edit", message || "Unknown error");
        }
    }

    getDisableValue = () => {
        const { data: { id, enabled } = {} } = this.props;
        return { id, enabled: !enabled };
    }

    getAction = () => {
        const { data: { enabled } = {}, others = {} } = this.props;
        const { showEdit = false, isPopUp } = others;
        const poProps = {
            url: "/service/consumable/change_enabled",
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to change the state"); },
            onSuccess: this.onEnabSuccess,
            valueGetter: this.getDisableValue,
        }
        if (showEdit && !isPopUp) {
            return <PostButton {...poProps} needConfirmation={true} varient={enabled ? "danger" : "warning"} confirmMessage={enabled ? "Do you want to disable" : "Do you want to enable"}>
                {enabled ? "Disable" : "Enable"}
            </PostButton>;
        }
        if (isPopUp) {
            // show select
        }
        return ""
    }

    render() {
        const { uuid } = this.state;
        const { serial, data: { product, consumable, consume, enabled } = {}, editNeeded = true, isPopUp = false } = this.props;
        let action = "";

        return (
            <tr key={uuid} className={enabled ? "" : "text-decoration-line-through"}>
                <th>{serial}</th>
                <td>{product.localId}</td>
                <td>{getProductName(product)}</td>
                <td>{consumable.localId}</td>
                <td>{getProductName(consumable)}</td>
                <td>{consumable.type}</td>
                <td style={{ "width": "180px" }}>{this.getConsumeEdit()}</td>
                <td className="text-end">{this.getAction()}</td>
            </tr>
        );
    }
}