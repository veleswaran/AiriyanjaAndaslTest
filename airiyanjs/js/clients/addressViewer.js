import React from "react";
import { GetAslModules, importASL } from "../utilities/utilities";
import { renderAddress, renderContact } from "./utilities";
import { ClientAdd } from "./clientAdd";
import { RESULT_SUCCESS } from "../globals/constants";
import { uuidv4 } from "../utilities/uuidv4";
import { formateAmount } from "../utilities/uiUtils";

const MultiView = GetAslModules("MultiView");
const TableView = GetAslModules('TableView');
const PostButton = GetAslModules("PostButton");

export class AddressViewer extends React.Component {
    multiViewRef = React.createRef(null);
    constructor(props) {
        super(props)
        const { data = {} } = this.props;
        this.state = { uuid: uuidv4(), details: this.getFilteredData() };
    }

    getFilteredData = () => {
        const { data = {} } = this.props;
        const { details = [] } = data;
        const res = [];
        for (const detail of details) {
            if (detail.enabled) {
                res.push(detail);
            }
        }
        return res;
    }

    onViewToggleChange = (e) => {
        const { data = {} } = this.props;
        let newDetails = []
        if (e.target.checked) {
            const { details = [] } = data;
            newDetails = details;
        } else {
            newDetails = this.getFilteredData()
        }
        this.setState({ details: newDetails });
        this.multiViewRef.current.setData({ from: 0, data: newDetails });
    }


    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getLedgers = () => {
        const { data = {}, ledgerNeeded = false } = this.props;
        const { ledger = [] } = data;
        if (ledger.length > 0 && ledgerNeeded) {
            return <table className="table table-group-divider table-striped mt-3">
                <thead>
                    <tr><th colSpan={2} className="text-center">Ledger</th></tr>
                    <tr><td>Account</td><td>Amount</td></tr>
                </thead>
                <tbody>
                    {ledger.map((ld, idx) => {
                        const { name, amount } = ld;
                        return <tr key={idx}><td>{name}</td><td>{formateAmount(amount)}</td></tr>
                    })}
                </tbody>
            </table>
        }
        return "";
    }

    onSuccess = (dta) => {
        const { details = [] } = dta;
        const { data = {} } = this.props;
        data.details = details;
        this.multiViewRef.current.setData({ from: 0, data: details });
    }

    addNewAddress = () => {
        const { data = {} } = this.props;
        const { id, type, name } = data;
        this.POPUP.current.showPopUp("Add new address for - " + name, ClientAdd, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { url: `/service/client/${type}/detail/add`, clientId: id, onSuccess: this.onSuccess } });
    }

    setDefaultSuccess = (rData, payload) => {
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            const { details } = this.state;
            const { id } = payload;
            for (const detail of details) {
                if (detail.id === id) {
                    detail.isDefault = true;
                } else {
                    detail.isDefault = false;
                }
            }
            this.setState({ details });
            this.TOAST.current.showSuccess("Success", "Address set as default");
        } else {
            this.TOAST.current?.showFailed("Unable to cancel", message || "Unknown error");
        }
    }

    setEnableSuccess = (rData, payload) => {
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            const { details } = this.state;
            const { id, enabled } = payload;
            for (const detail of details) {
                if (detail.id === id) {
                    detail.enabled = enabled;
                }
            }
            this.setState({ details });
            this.TOAST.current.showSuccess("Success", enabled ? "Address Enabled" : "Address Disabled");
        } else {
            this.TOAST.current?.showFailed("Unable to cancel", message || "Unknown error");
        }
    }

    errorNotification = (e) => {
        const { body = null } = e;
        if (body !== null) {
            const { message } = body;
            this.TOAST.current?.showFailed("Error", message || "Unable perform Operation");
        } else {
            this.TOAST.current?.showFailed("Error", "Unable perform Operation");
        }
    }

    usualActionRenderer = (keyVal, data) => {
        const { data: mData } = this.props;
        const { type } = mData;
        const { isDefault = false, enabled = false, clientId, id } = data;
        const actions = [];
        if (!isDefault && enabled) {
            actions.push(<li><PostButton url={`/service/client/${type}/detail/setdefault`} valueGetter={() => { return { clientId, id } }}
                onSuccess={(dta) => this.setDefaultSuccess(dta, { clientId, id })} onError={this.errorNotification} varient="outlined" css="dropdown-item">
                Make Default
            </PostButton></li>)
        }
        actions.push(<li><PostButton url={`/service/client/${type}/detail/setenable`} valueGetter={() => { return { clientId, id, enabled: !enabled } }}
            onSuccess={(dta) => this.setEnableSuccess(dta, { clientId, id, enabled: !enabled })} onError={this.errorNotification} varient="outlined" css="dropdown-item">
            {enabled ? "Disable" : "Enable"}
        </PostButton></li>)
        return <>
            <button className="btn btn-sm btn-light border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots"></i>
            </button>
            <ul class="dropdown-menu">
                {actions}
            </ul>
        </>
    }

    styleFunc = (data) => {
        const { isDefault = false, enabled = false } = data;
        if (!enabled) {
            return "text-decoration-line-through"
        }
        if (isDefault) {
            return "fw-bold"
        }
        return "";
    }

    render() {
        const { onClose, onSelect, needSelect } = this.props;
        const { details = [], uuid } = this.state;
        const headings = ["Billing Name", "Address", "Contact"];
        const actionRender = (keyVal, data) => {
            const onc = () => {
                onSelect?.(data);
                onClose?.();
            }
            return <button className="btn btn-sm btn-primary" onClick={onc} >Select</button>;
        }
        const cells = [{ key: "billingName" }, { key: "detailData", renderer: renderAddress }, { key: "detailData", renderer: renderContact }];
        headings.push("Action");
        if (needSelect) {
            cells.push({ key: "detailData", renderer: actionRender });
        } else {
            cells.push({ key: "detailData", renderer: this.usualActionRenderer });
        }
        const views = [
            {
                view: TableView,
                iconStyle: "bi bi-table",
                props: {
                    headings, cells,
                    rowParam: { styleFunc: this.styleFunc },
                    style:"table table-striped table-hover m-0 small"
                }
            }
        ]
        return <div>
            <div className="d-flex justify-content-between">
                <button className="btn btn-sm btn-primary bi bi-plus-lg" onClick={this.addNewAddress}></button>
                <div className={needSelect ? "visually-hidden" : "form-check form-switch"}>
                    <label class="form-check-label" for={uuid}>Show Disabled</label>
                    <input class="form-check-input" type="checkbox" role="switch" id={uuid} onChange={this.onViewToggleChange} />
                </div>
            </div>
            <MultiView ref={this.multiViewRef} views={views} data={details} />
            {this.getLedgers()}
        </div>;
    }
}

