import React from "react";
import { PaymentTypeSearch } from "./paymentTypeSearch";
import { AddPaymentMethod } from "./AddPaymentMethod";
import { Button } from "react-bootstrap";
import { importASL } from "../../utilities/utilities";

export class PaymentTypePage extends React.Component {
    paymentTypeRef = React.createRef(null);
    constructor(props) {
        super(props)
    }
    async componentDidMount(){
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }
    showPaymentTypeAdd = () => {
        this.POPUP.current.showPopUp("Add Payment Type", AddPaymentMethod,"bg-warning",{ modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark" }});
    }
    render() {
        return (
            <div className="container">
                <div className="row m-0">
                    <div> <Button variant="primary" onClick={this.showPaymentTypeAdd}>Add Payment Type</Button> </div>
                    <div className="col mt-2">
                        <PaymentTypeSearch ref={this.paymentTypeRef} url="service/consumable/search" />
                    </div>
                </div>
            </div>
        );
    }
}