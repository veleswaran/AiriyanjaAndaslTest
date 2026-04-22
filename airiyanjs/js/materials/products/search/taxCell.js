import React from "react";
import { importASL, GetAslModules } from "../../../utilities/utilities";
import { getProductSpec } from "../utilities";
import { RESULT_SUCCESS } from "../../../globals/constants";
import { uuidv4 } from "../../../utilities/uuidv4";
import { TaxSearch } from "../../../taxing/taxSearch";

const MultiRender = GetAslModules("MultiRender");
const PostButton = GetAslModules("PostButton");
const EditBox = GetAslModules("EditBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");

export class TaxCell extends React.Component {
    constructor(props) {
        super(props);
        const { data = {} } = this.props;
        const { productTax = [] } = data;
        this.state = { taxes: productTax };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }


    onEditClick = () => {
        const { data = {} } = this.props;
        const { localId } = data;
        const { productName } = getProductSpec(data);
        this.POPUP.current?.showPopUp("(" + localId + ") Edit tax for :- " + productName, TaxEditor, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { data } });
    }

    render() {
        const { needEdit = false, data = {} } = this.props;
        const { productTax = [] } = data;
        const txList = [];
        productTax.forEach(pt => {
            const { percent, enabled, tax: { type } = {} } = pt;
            if (enabled) {
                txList.push(<div>{type + " - " + percent + "%"}</div>);
            }
        });
        const list = txList.length > 0 ? <div className="form-control-sm border border-secondary-subtle">{txList}</div> : "";
        if (needEdit) {
            return <td>
                <div className="input-group">
                    {list}
                    <button className="btn btn-sm btn-secondary bi bi-pencil-fill" onClick={this.onEditClick}></button>
                </div>
            </td>
        }
        return <td>
            {list}
        </td>
    }
}

class TaxEditor extends React.Component {
    taxListRef = React.createRef(null);
    constructor(props) {
        super(props);
        const { data = {} } = this.props;
        const { productTax = [] } = data;
        this.state = { taxes: productTax };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
        this.fillData();
    }

    fillData = () => {
        const { taxes } = this.state;
        taxes.forEach(tx => {
            this.taxListRef.current.add({ props: { data: tx } });
        });
    }

    render() {
        const { data = {} } = this.props;
        return <table className="table table-striped table-hover m-0 table-group-divider">
            <thead>
                <AddNewTax data={data} onAdded={this.fillData} />
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>percent</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <MultiRender ref={this.taxListRef} component={TaxEditorRow} />
            </tbody>
        </table>
    }
}

class TaxEditorRow extends React.Component {
    editRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    percentValidator = (data) => {
        if (data < 0 || data > 100) {
            return false
        }
        return true;
    }

    onPercentSuccess = (rData) => {
        const { result, message } = rData;
        if (result === RESULT_SUCCESS) {
            const { data = {} } = this.props;
            const numeric = this.editRef.current?.getValue();
            data.percent = numeric;
            this.editRef.current.setValue(numeric);
            this.editRef.current.onCancel();
            this.setState({ upid: uuidv4() });
            this.TOAST.current?.showSuccess("Success", "Price edited Sucessfully");
        } else {
            this.TOAST.current?.showFailed("Unable edit", message || "Unknown error");
        }
    }

    percentGetVal = () => {
        const { data: { id, productId } = {} } = this.props;
        const percentage = this.editRef.current?.getValue();
        return { id, productId, percentage };
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
        const { data: { id, enabled, productId } = {} } = this.props;
        return { id, enabled: !enabled, productId };
    }

    render() {
        const { serial, data = {} } = this.props;
        const { enabled, percent, tax: { type } = {} } = data;
        const poProps = {
            url: "/service/product_tax/change_enabled",
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to change the state"); },
            onSuccess: this.onEnabSuccess,
            valueGetter: this.getDisableValue,
        }
        const textInputProps = {
            placeholder: "Percent %",
            positiveOnly: true,
            validator: this.percentValidator
        };
        const postProps = {
            url: "/service/product_tax/change",
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to edit percent"); },
            onSuccess: this.onPercentSuccess,
            valueGetter: this.percentGetVal
        };
        return <tr className={enabled ? "" : "text-decoration-line-through"}>
            <th>{serial}</th>
            <td>{type}</td>
            <td style={{ "width": "180px" }}>
                <EditBox ref={this.editRef} value={percent} css="input-group-sm" label={"%"} textInput={TitledDecimalTextBox} textInputProps={textInputProps} postProps={postProps} />
            </td>
            <td>
                <PostButton {...poProps} needConfirmation={true} varient={enabled ? "danger" : "warning"} confirmMessage={enabled ? "Do you want to disable" : "Do you want to enable"}>
                    {enabled ? "Disable" : "Enable"}
                </PostButton>
            </td>
        </tr>;
    }
}

class AddNewTax extends React.Component {
    percentRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = { tax: null };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    percentValidator = (vl) => {
        if (vl <= 0 || vl > 100) {
            return false;
        }
        return true;
    }

    onTaxSelected = (tax) => {
        this.setState({ tax });
    }

    onSearchClick = () => {
        this.POPUP.current?.showPopUp("Select tax type", TaxSearch, "", { modalProps: { className: "bg-opacity-75 bg-dark" }, props: { onSelect: this.onTaxSelected } });
    }

    onAddSuccess = (rData) => {
        const { result, message, data: ptx } = rData;
        if (result === RESULT_SUCCESS) {
            const { data = {}, onAdded } = this.props;
            const { tax } = this.state;
            data.productTax.push({ ...ptx, tax });
            this.setState({ tax: null });
            this.TOAST.current?.showSuccess("Success", "Tax Added successfully");
            if (onAdded) {
                onAdded();
            }
        } else {
            this.TOAST.current?.showFailed("Unable Add", message || "Unknown error");
        }
    }

    addValueGet = () => {
        const { data: { id } = {} } = this.props;
        const { tax } = this.state;
        const percentage = this.percentRef.current.getValue();
        return { productId: id, taxId: tax.id, percentage }
    }

    postValidator = () => {
        if (!this.percentRef.current.isValid()) {
            this.TOAST.current?.showFailed("Invalid percentage", "Enter valid percentage");
            return false;
        }
        return true;
    }

    render() {
        const { tax } = this.state;
        const btn = <button className="btn btn-sm btn-secondary bi bi-plus" onClick={this.onSearchClick}></button>;
        const addBprops = {
            url: "/service/product_tax/add",
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to Add tax"); },
            onSuccess: this.onAddSuccess,
            valueGetter: this.addValueGet,
            validator: this.postValidator,
        }
        if (tax) {
            const { type } = tax;
            return <tr style={{ "vertical-align": "middle" }}>
                <th>{btn}</th>
                <th>
                    {type}
                </th>
                <th>
                    <TitledDecimalTextBox positiveOnly={true} placeholder="Percentage %" ref={this.percentRef} value={0} validator={this.percentValidator} />
                </th>
                <th>
                    <PostButton {...addBprops} needConfirmation={true} varient="primary" confirmMessage="Do you want to add?">Add</PostButton>
                </th>
            </tr>
        }
        return <tr>
            <th>{btn}</th><th></th><th></th><th></th>
        </tr>;
    }
}


