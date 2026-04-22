import React from "react";
import { ClientPicker } from "../../clients/clientPicker";
import { BillPicker } from "./billPicker";


export class BillClientPicker extends React.Component {
    clientRef = React.createRef(null);
    shippedToRef = React.createRef(null);
    billRef = React.createRef(null);
    transporterRef = React.createRef(null);
    constructor(props) {
        super(props);
        this.state = {};
    }

    urlProcessor = () => {
        const { clientUrl, searchBillBaseUrl } = this.props;
        let url = null;
        if (this.clientRef.current) {
            const clientDetail = this.clientRef.current.getValue();
            if (clientDetail) {
                const { clientId } = clientDetail
                url = `${searchBillBaseUrl}/${clientId}`;
            }
        }
        return { url, clientUrl };
    }

    getValue = () => {
        const { prevBillNeeded = false } = this.props;
        const client = this.clientRef.current?.getValue();
        let bill;
        if (prevBillNeeded && this.billRef.current) {
            bill = this.billRef.current.getValue();
        }
        const shippedTo = this.shippedToRef.current?.getValue();
        const transporter = this.transporterRef.current?.getValue();
        return { client, bill, shippedTo, transporter };
    }


    onReset = () => {
        if (this.billRef.current) {
            this.billRef.current.handleClearBill();
        }
    }

    render() {
        const { clientUrl, prevBillNeeded = false, title = "Previous Bill", transporter = {}, businessData, baseUrl, clientType } = this.props;
        const { onSelect, onReset } = transporter;
        return <div className="d-flex flex-wrap gap-1">
            <ClientPicker ref={this.clientRef} url={clientUrl} baseUrl={baseUrl} clientType={clientType} businessData={businessData} onReset={this.onReset} title="Billed To" css="flex-fill" />
            <ClientPicker ref={this.shippedToRef} url={clientUrl} baseUrl={baseUrl} clientType={clientType} businessData={businessData} title="Shipped To" isMandatory={false} css="flex-fill" />
            <ClientPicker ref={this.transporterRef} url='/service/client/TRANSPORTER/search' baseUrl={baseUrl} clientType="TRANSPORTER" businessData={businessData} onSelect={onSelect} onReset={onReset} title="Transporter" css="flex-fill" isMandatory={false} />
            <BillPicker ref={this.billRef} urlProcessor={this.urlProcessor} title={title} css={"flex-fill " + (prevBillNeeded ? "" : "d-none")} />
        </div>
    }
}
