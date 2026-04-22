import React from "react";
import { PaymentTypeSearch } from "./paymentTypeSearch";
import { importASL } from "../../utilities/utilities";
import { PickerButton } from "../../common/pickerButton";

export class PaymentTypePicker extends React.Component {
    buttonRef = React.createRef(null)
    constructor(props) {
        super(props);
        this.state = { paymentType: {}, validClass: "", validBtnCss: "" };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    isValid() {
        const vld = this.buttonRef.current.isValid();
        this.setState({ validClass: vld ? "" : "text-danger" });
        return vld;
    }

    selected = (data) => {
        const { onSelect } = this.props;
        this.setState({ paymentType: data }, () => {
            this.isValid();
            onSelect?.(data);
        });
    }

    getValue() {
        const { paymentType } = this.state;
        return paymentType;
    }

    render() {
        const { paymentType: { name = "" } = {}, validClass } = this.state;
        const { css = "d-flex", style = {} } = this.props;
        return <div className={css} style={style}>
            <span className={`fw-bold align-content-center ${validClass}`}>Payment Type :</span>
            <span className="flex-fill ms-2 align-content-center">{name}</span>
            <div>
                <PickerButton cssPlus="btn-sm" ref={this.buttonRef} searchComponent={PaymentTypeSearch} searchProps={{ enabledOnly: true }} onSelect={this.selected} modalProps={{ css: { body: "p-1" } }} title="Select Payment type" />
            </div>
        </div>;
    }
}
