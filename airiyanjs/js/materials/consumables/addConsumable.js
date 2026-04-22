import React from "react";
import { Button } from "react-bootstrap";
import { importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS } from "../../globals/constants";
import { getProductName } from "../products/utilities";
import { GetAslModules } from "../../utilities/utilities";
import { ProductSearch } from "../products/productSearch";

const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const PostButton = GetAslModules("PostButton");

export class AddConsumable extends React.Component {
    textRef = React.createRef(null);
    constructor(props) {
        super(props);
        this.state = { product: null, cproduct: null };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    clean = () => {
        this.setState({ cproduct: null });
    }

    setProduct = (product) => {
        this.setState({ product });
    }

    cproductSelected = (cproduct) => {
        this.setState({ cproduct });
    }

    showProductPicker = () => {
        const comProps = {  onSelect: this.cproductSelected, };
        this.POPUP.current.showPopUp("Select Product", ProductSearch, "bg-warning",{ modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props:comProps} );
    }

    getValue = () => {
        const { product, cproduct } = this.state;
        const val = parseFloat(this.textRef.current?.getValue() || 0);
        return { productId: product.id, consumeId: cproduct.id, consume: val };
    }

    validator = () => {
        const { product, cproduct } = this.state;
        const val = this.textRef.current?.getValue() || 0;
        if (!product) {
            this.TOAST.current.showWarning("Main Product Not selected", "Selected pick product");
            return false;
        }
        if (!cproduct) {
            this.TOAST.current.showWarning("Consume Product Not selected", "Selected consumable product");
            return false;
        }
        if (!val || val <= 0) {
            this.TOAST.current.showWarning("Invalid Consume count", "Add valid consumable count");
            return false;
        }
        return true;
    }

    onSuccess = (data) => {
        const { onSuccess } = this.props;
        const { result, message } = data;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current.showSuccess("Success", "Consumable added sucessfully");
            this.setState({ cproduct: null });
            if (onSuccess) {
                onSuccess();
            }
        } else {
            this.TOAST.current.showFailed("Unable to add", message);
        }
    }

    onError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "");
    }

    render() {
        const { product, cproduct } = this.state;
        let content = "";
        if (product) {
            if (cproduct) {
                content = <tr>
                    <td>{cproduct.localId}</td>
                    <td>{getProductName(cproduct)}</td>
                    <td>{cproduct.type}</td>
                    <td>
                        <TitledDecimalTextBox positiveOnly={true} ref={this.textRef} placeholder="consumable per unit" />
                    </td>
                    <td>
                        <div className="input-group">
                            <Button variant="secondary" onClick={this.showProductPicker}>Change Consumable</Button>
                            <PostButton url="/service/consumable/add" valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add" />
                        </div>
                    </td>
                </tr>;
            } else {
                content = <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <Button variant="secondary" onClick={this.showProductPicker}>Add Consumable</Button>
                    </td>
                </tr>;
            }
            return (
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Consumable Product Id</th>
                            <th>Consumable</th>
                            <th>Consumable Type</th>
                            <th>Consumes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </table>
            );
        }
        return "";
    }
}