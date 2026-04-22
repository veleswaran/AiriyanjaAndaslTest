import React, { Component } from 'react';
import { importASL } from '../utilities/utilities';
import { ClientSearch } from './clientSearch';
import { formateAmount } from '../utilities/uiUtils';
import { CONTACT_GROUP, renderAddress } from './utilities';
import { ClientAdd } from './clientAdd';
import { AddGstClient } from './adder/addGstClient';

export class ClientPicker extends Component {
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
    const { isMandatory = true } = this.props;
    const { client, clientDetail } = this.state;
    const valid = clientDetail !== null && client !== null;
    if (isMandatory) {
      this.setState({ validClass: valid ? "" : "border-danger" });
    } else {
      this.setState({ validClass: "" });
    }
    return isMandatory ? valid : true;
  }

  getValue = () => {
    const { clientDetail } = this.state;
    return clientDetail;
  }

  getValueFull = () => {
    const { clientDetail, client } = this.state;
    return { client, clientDetail };
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
    const { url } = this.props;
    const comProps = { url, onSelect: this.clientSelected, };
    this.POPUP.current.showPopUp("Select client", ClientSearch, 'bg-warning', { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: comProps });
  }
  showClientAdd = (addFromGST) => {
    const { popUpTitle = "Add Client", gstMandatory = false, baseUrl, clientType } = this.props
    let url = `${baseUrl}/${clientType}`;
    if (addFromGST) {
      url = `${url}/addfrmgst`;
    } else {
      url = `${url}/add`;
    }

    this.POPUP.current.showPopUp(popUpTitle, addFromGST ? AddGstClient : ClientAdd, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { url, gstMandatory: gstMandatory || addFromGST } });
  }


  render() {
    const { title = "Client", css = "", style = {}, businessData = {} } = this.props;
    const { clientDetail, client, validClass } = this.state;
    const { billingName = "" } = clientDetail || {};

    const { gst } = businessData;
    const addButtons = [<li><button className="dropdown-item bi bi-plus" onClick={() => this.showClientAdd(false)}>Directly</button></li>
    ];
    if (gst) {
      addButtons.push(<li><button className="dropdown-item bi bi-plus" onClick={() => this.showClientAdd(true)}>From GST</button></li>);
    }
    return <div className={css} style={style}>
      <div className={`h-100 card ${validClass}`}>
        <div className='card-header p-2'>
          <div className='row m-0'>
            <div className='col p-0 align-content-center'>{title} : <strong>{billingName}</strong></div>
            <div className='col p-0 text-end'>
              <div className='btn-group btn-group-sm'>
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"><i className='bi bi-plus-lg'></i></button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {addButtons}
                  </ul>
                </div>

                <button className='btn btn-outline-primary' onClick={this.showClientPopup} title={clientDetail ? "Change Client" : "Select Client"}><i className='bi bi-pencil-fill'></i></button>
                <button className={'btn btn-outline-danger' + (clientDetail ? "" : " disabled")} onClick={this.handleClearClient} title='Clear Selection'><i className="bi bi-brush"></i>clear</button>
              </div>
            </div>
          </div>
        </div>
        <div className='card-body p-1' style={{ minHeight: "100px" }}>
          {clientDetail ? <ClientView client={client} clientDetail={clientDetail} handleClearClient={this.handleClearClient} /> : ""}
        </div>
      </div>
    </div>;
  }
}

export class ClientView extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { clientDetail, client, buttonNeeded = true, css = "card p-1" } = this.props;
    const { detailData = {} } = clientDetail || {};
    const { amount = 0 } = client || {};
    const rows = [];
    CONTACT_GROUP.forEach(key => {
      if (detailData && detailData[key]) {
        rows.push(<tr><th className="text-secondary">{key.toLowerCase()}</th><td>:</td><td className="text-muted">{detailData[key]}</td></tr>);
      }
    });
    return <table className="m-2 table-sm small m-0">
      <tbody>
        <tr><th className="text-secondary">Balance</th><td>:</td><td>{formateAmount(amount)}</td></tr>
        <tr><th className="text-end text-secondary">Address</th><td>:</td><td className="text-muted d-flex gap-1">{renderAddress(clientDetail.detailData)}</td></tr>
        {rows}
      </tbody>
    </table>;
  }


}
