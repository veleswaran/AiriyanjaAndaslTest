import React, { Component } from 'react';
import { useOutletContext } from "react-router-dom";
import { GetAslModules, importASL } from '../utilities/utilities.js';
import { ClientPicker } from '../clients/clientPicker.js';
import { PaymentTypePicker } from './method/paymentTypePicker.js';
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from '../globals/constants.js';
import { IsWriteOff } from './others/isWriteOff.js';
import { positiveValidator, stringNotNullOrEmpty } from '../utilities/validators.js';
import { PurposePicker } from '../remittance/purpose/purposePicker.js';

import('../css/common.css');

const TitledText = GetAslModules("TitledTextBox");
const TitledTextArea = GetAslModules("TitledTextArea");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const PostButton = GetAslModules("PostButton");

export class AddPayment extends Component {
    clientRef = React.createRef(null);
    paymentTypeRef = React.createRef(null);
    amountRef = React.createRef(null);
    writeOffRef = React.createRef(null);
    referenceRef = React.createRef(null);
    notesRef = React.createRef(null);
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    validator = () => {
        let res = true;
        const refs = [this.clientRef, this.paymentTypeRef, this.amountRef, this.referenceRef, this.notesRef];
        for (const rf of refs) {
            if (rf.current && !rf.current?.isValid()) {
                res = false;
            }
        }
        return res;
    }

    onSuccess = (data) => {
        const { result, message } = data;
        if (data.result === RESULT_SUCCESS) {
            this.POPUP.current.showSuccess("Success", "New Payment added successfully", () => window.location.reload());
        } else if (data.result === RESULT_UNSUCCESS) {
            this.TOAST.current.showFailed("UnSuccess", message || "Unable to add");
        } else {
            this.TOAST.current.showFailed("Error", "unable to add the Payment");
        }
    }

    valueGetter = () => {
        const { madeFor } = this.props;
        const clientData = this.clientRef.current.getValueFull();
        const paymentType = this.paymentTypeRef.current.getValue();
        const amount = this.amountRef.current.getValue();
        const writeOff = this.writeOffRef.current.getValue();
        const referenceDetails = this.referenceRef.current.getValue();
        const notes = this.notesRef.current.getValue();
        return {
            madeFor,
            clientId: clientData?.client?.id,
            paymentTypeId: paymentType?.id,
            amount,
            writeOff,
            referenceDetails,
            notes
        };
    }

    render() {
        const { url, clientUrl, madeFor, baseUrl, clientType, businessData } = this.props;
        const poProps = {
            url,
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to add the Payment"); },
            onSuccess: this.onSuccess,
            valueGetter: this.valueGetter,
        }
        return (
            <div className='card p-0 container overflow-auto'>
                <table className='table'>
                    <thead>
                        <tr><th className='text-center'><h4 className='m-0'>{madeFor} Payment</h4></th></tr>
                    </thead>
                    <tbody>
                        <tr><td><ClientPicker ref={this.clientRef} url={clientUrl} baseUrl={baseUrl} clientType={clientType} businessData={businessData} onSelect={this.onClientSelected} /></td></tr>
                        <tr><td><TitledDecimalTextBox ref={this.amountRef} positiveOnly={true} placeholder="Amount" validator={positiveValidator} /></td></tr>
                        <tr><td><IsWriteOff ref={this.writeOffRef}/></td></tr>
                        <tr><td><PaymentTypePicker ref={this.paymentTypeRef} onSelect={this.onPaymentTypeSelect} /></td></tr>
                        <tr><td><TitledText ref={this.referenceRef} placeholder="Payment Reference" validator={stringNotNullOrEmpty} /></td></tr>
                        <tr><td><TitledTextArea ref={this.notesRef} placeholder="Notes" class="titledTextArea" validator={stringNotNullOrEmpty} /></td></tr>
                        <tr><td className='text-end'>
                            <PostButton {...poProps} validator={this.validator} >Add</PostButton>
                        </td></tr>
                    </tbody>
                </table>
            </div>
        )
    }
}


export const salesAddPayment = function (props) {
    const { businessData } = useOutletContext();
    return <AddPayment {...props} url="/service/payment/SALES/add" clientUrl="/service/client/SALES/search" baseUrl="/service/client" clientType="SALES" madeFor="SALES" businessData={businessData} />
};

export const purchaseAddPayment = function (props) {
    const { businessData } = useOutletContext();
    return <AddPayment {...props} url="/service/payment/PURCHASE/add" clientUrl="/service/client/PURCHASE/search" baseUrl="/service/client" clientType="PURCHASE" madeFor="PURCHASE" needPurpose={true} businessData={businessData} />
};

