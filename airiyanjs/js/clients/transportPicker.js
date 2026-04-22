import React, { Component } from 'react';
import { GetAslModules, importASL } from '../utilities/utilities';
import { ClientSearch } from './clientSearch';
import { ClientView } from './clientPicker';
import { gstVehicleNumberValidator } from '../utilities/validators';

const TitledTextBox = GetAslModules("TitledTextBox");

export class TransportPicker extends Component {
    vehicleRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = { client: null, clientDetail: null, validClass: "btn-outline-primary" };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    isValid = () => {
        const { isMandatory = false } = this.props;
        const { client, clientDetail } = this.state;
        const valid = (clientDetail !== null && client !== null) || this.vehicleRef.current?.isValid();
        if (isMandatory) {
            this.setState({ validClass: valid ? "" : "border-danger" });
        } else {
            this.setState({ validClass: "" });
        }
        return isMandatory ? valid : true;
    }

    getValue = () => {
        const { clientDetail } = this.state;
        if (clientDetail) {
            const { clientId, id: clientDetailId } = clientDetail;
            return { clientId, clientDetailId };
        }
        const vehicleNo = this.vehicleRef.current?.getValue();
        if (vehicleNo && vehicleNo.trim().length > 0) {
            return { vehicleNo };
        }
        return null;
    }

    handleClearClient = () => {
        const { onReset } = this.props;
        this.setState({ clientDetail: null, client: null }, () => { this.isValid(); onReset?.(); });
    };

    clientSelected = (selected, client) => {
        this.setState({ clientDetail: selected, client }, this.isValid);
        const { onSelect } = this.props;
        onSelect?.(selected, client);
    }

    showClientPopup = () => {
        const comProps = { url: "/service/client/TRANSPORTER/search", onSelect: this.clientSelected, };
        this.POPUP.current.showPopUp("Select Transporter", ClientSearch, 'bg-warning', { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: comProps });
    }

    vehicleValidator = (value) => {
        const { isMandatory = false } = this.props;
        if (!value || value.trim().length === 0) {
            return isMandatory ? false : true;
        }
        return gstVehicleNumberValidator(value);
    }

    render() {
        const { title = "Client", css = "", style = {} } = this.props;
        const { clientDetail, client, validClass } = this.state;
        const { billingName = "" } = clientDetail || {};
        return <div className={css} style={style}>
            <div className={`h-100 card ${validClass}`}>
                <div className='card-header p-2'>
                    <div className='row m-0'>
                        <div className='col p-0 align-content-center'>{title} : <strong>{billingName}</strong></div>
                        <div className='col p-0 text-end'>
                            <div className='btn-group btn-group-sm'>
                                <button className='btn btn-outline-primary' onClick={this.showClientPopup}>{clientDetail ? "change" : "select"}</button>
                                <button className={'btn btn-outline-primary' + (clientDetail ? "" : " disabled")} onClick={this.handleClearClient}>clear</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card-body p-1' style={{ minHeight: "100px" }}>
                    {clientDetail ? <ClientView client={client} clientDetail={clientDetail} handleClearClient={this.handleClearClient} /> :
                        <TitledTextBox ref={this.vehicleRef} placeholder="Vehicle Number" type="text" validator={this.vehicleValidator} />}
                </div>
            </div>
        </div>;
    }
}