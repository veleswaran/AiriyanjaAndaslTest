import React from "react";
import { useOutletContext } from "react-router-dom";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { SearchClientLoomRow } from "./searchClientLoomRow";
import { ClientPicker } from "../../../clients/clientPicker"

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const TitledTextBox = GetAslModules("TitledTextBox");

export class SearchClientLoomClass extends React.Component {
    textRef = React.createRef(null);
    clientRef = React.createRef(null);
    searchRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    callZero = () => {
        this.searchRef.current?.callZero();
    }

    onClientSelected = (Data) => {
        const { clientId } = Data || {};
        const number = this.textRef.current.getValue() || "";
        let payload = { query: { number } };
        if (clientId > 0) {
            payload.query.clientId = clientId;
        }
        this.searchRef.current.setQuery({ query: payload });
    }

    onClientReset = () => {
        const number = this.textRef.current.getValue() || "";
        this.setFilter(number, null);
    }

    onSearchFormClick = (number) => {
        const { clientId } = this.clientRef.current.getValue() || {};
        let payload = { query: { number } };
        if (clientId > 0) {
            payload.query.clientId = clientId;
        }
        this.searchRef.current.setQuery({ query: payload });
    }

    render() {
        const { onSelect, onClose, isPopUp = false, query = {} } = this.props;
        const headings = ["Client Name", "Loom Number", "Loom Specs", "Running Style", "Action"];
        const searchProps = {
            query: { query },
            url: "/service/client_loom/search",
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table", props: {
                        headings, row: SearchClientLoomRow,
                        rowParam: { others: { needSelect: isPopUp, onSelect, onClose, refresh: this.refresh } }, headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        const { baseUrl = "/service/client", clientType = "PURCHASE", businessData = {} } = this.props;
        return (
            <div className="gap-1">
                <div className="row m-0">
                    <div className="col">
                        <ClientPicker ref={this.clientRef} url={`${baseUrl}/${clientType}/search`} baseUrl={baseUrl} clientType={clientType} businessData={businessData} onSelect={this.onClientSelected} onReset={this.onClientSelected} />
                    </div>
                    <div className="col-3 align-content-center">
                        <TitledTextBox ref={this.textRef} placeholder="Loom Number" onChange={this.onSearchFormClick} />
                    </div>
                </div>
                <div className="row m-0 mt-1">
                    <div className="col">
                        <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
                    </div>
                </div>
            </div>
        );
    }
}

export const SearchClientLoom = (props) => {
    const { businessData } = useOutletContext();
    return <SearchClientLoomClass {...props} businessData={businessData} />
}