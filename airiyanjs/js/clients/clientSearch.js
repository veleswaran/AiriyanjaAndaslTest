import React from "react";
import { GetAslModules, importASL } from "../utilities/utilities";
import { AddressViewer } from "./addressViewer";
import { LedgerView } from "./views/LedgerView";
import { formateAmount } from "../utilities/uiUtils";
import { ActivitySearch } from "./activity/activitySearch";
import { wildcardProcessor } from "../utilities/searchUtilitiies";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const ChipsSearch = GetAslModules("ChipsSearch");

export class ClientSearch extends React.Component {
    filterRef = React.createRef(null);
    searchRef = React.createRef(null);
    constructor(props) {
        super(props);

    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    callZero = () => {
        this.searchRef.current?.callZero();
    }

    onSearchUpdate = () => {
        const searchChips = this.filterRef.current.getValue();
        const payload = { query: searchChips };
        this.searchRef.current.setQuery({ query: payload });
    }

    render() {
        const { url = "", isPopUp = false, onSelect, onClose } = this.props;
        const headings = ["CID", "Name", "Balance", "Notes", "Action"];
        const searchProps = {
            query: { query: {} },
            url,
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table", props: {
                        headings,
                        row: SearchRow,
                        rowParam: { others: { needSelect: isPopUp, onSelect, onClose } },
                        headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        const filters = {
            name: { count: 5, validator: nameValidatorChips, type: "nonkey", valueProcessor: wildcardProcessor },
            mobile: { count: 5, validator: mobileValidatorChips, valueProcessor: wildcardProcessor },
            gst: { count: 5, validator: gstValidatorChips, valueProcessor: wildcardProcessor }
        };
        return (
            <div>
                <div>
                    <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search Client e.g name:test" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
                </div>
                <div className="mt-1">
                    <SearchCaller ref={this.searchRef} {...searchProps}></SearchCaller>
                </div>
            </div >
        );
    }
}

class SearchRow extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onClickActivity = (data) => {
        this.POPUP.current.showPopUp(`Activity of: ${data.name}`, ActivitySearch, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark", css: { footer: "visually-hidden" } }, props: { clientId: data.id, url: "/service/client_activity/search" } });
    }

    actionRendered = () => {
        const { data = {}, others = {} } = this.props;
        const { type, notes = "", name } = data;
        const { needSelect = false, onSelect, onClose } = others;
        const onClientSelected = (datum) => {
            if (onSelect) {
                onSelect(datum, data)
            }
            if (onClose) {
                onClose();
            }
        };
        const allButton = [
            <button className={"btn btn-sm " + (needSelect ? "btn-primary" : "btn-outline-secondary")} onClick={() => {
                const comProps = { data, onSelect: onClientSelected, needSelect: needSelect, ledgerNeeded: !needSelect };
                this.POPUP.current.showPopUp(name, AddressViewer, 'bg-warning', { footer: "Notes: " + notes, modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: comProps });
            }}>View</button>
        ];
        const actions = [];
        if (!needSelect) {
            allButton.push(
                <>
                    <button className="btn btn-sm btn-outline-secondary ms-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots"></i>
                    </button>
                    <ul class="dropdown-menu highlight">
                        <li>
                            <button className="dropdown-item" onClick={() => {
                                this.POPUP.current.showPopUp(`Ledger for: ${name}`, LedgerView, 'bg-warning', { footer: "Notes: " + notes, modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark", css: { body: "p-1", footer: "visually-hidden" } }, props: { data } });
                            }}>View Ledger</button>
                        </li>
                        <li><button className="dropdown-item" type="button" onClick={() => this.onClickActivity(data)}>View Activity</button></li>
                    </ul>
                </>
            );
        }
        return allButton;
    }

    render() {
        const { data = {}, serial } = this.props;
        const { name, amount, notes, localId } = data;
        return <tr>
            <th>{serial}</th>
            <td>{localId}</td>
            <td>{name}</td>
            <td>{formateAmount(amount)}</td>
            <td>{notes}</td>
            <td>{this.actionRendered()}</td>
        </tr>
    }

}

function mobileValidatorChips(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 2 || data.length > 12) {
        return false;
    }
    return true;
}
function gstValidatorChips(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 2 || data.length > 15) {
        return false;
    }
    return true;
}
function nameValidatorChips(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 2 || data.length > 20) {
        return false;
    }
    return true;
}