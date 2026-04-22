import React from "react";
import { ADDRESS_GROUP, CONTACT_GROUP, LOCATION_GROUP, renderAddress } from "./utilities";
import { formateAmount } from "../utilities/uiUtils";
import { objectToArray } from "../utilities/objectUtils";

export class ClientView extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { clientDetail, client, buttonNeeded = true, css = "card p-1" } = this.props;
    const { detailData } = clientDetail || {};
    const { amount } = client;
    const rows = [];
    CONTACT_GROUP.forEach(key => {
      if (detailData[key]) {
        rows.push(<tr><th className="text-secondary">{key.toLowerCase()} :</th><td className="text-muted">{detailData[key]}</td></tr>);
      }
    });
    return (
      <div className={css}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <table className="table table-borderless table-sm small">
              <tbody>
                <tr>
                  <th colSpan={2} className="fw-bold">{clientDetail.billingName}</th>
                </tr>
                <tr><th className="text-secondary">Balance :</th><td>{formateAmount(amount)}</td></tr>
                <tr><th className="text-secondary">Address :</th><td className="text-muted d-flex gap-1">{renderAddress(clientDetail.detailData)}</td></tr>
                {rows}
              </tbody>
            </table>
          </div>
          {buttonNeeded && <button type="button" className="btn btn-sm btn-outline-dark" onClick={this.props.handleClearClient}>Clear</button>}
        </div>
      </div>
    )
  }


}