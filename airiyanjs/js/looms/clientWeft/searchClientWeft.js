import React from "react";
import { useOutletContext } from "react-router-dom";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { SearchClientWeftRow } from "./searchClientWeftRow";
import { ClientPicker } from "../../clients/clientPicker";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');

export class SearchClientWeftClass extends React.Component {
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

    setClientId = (clientId) => {
        const payload = { query: { clientId } };
        this.searchRef.current.setQuery({ query: payload });
    }

    onSearchFormClick = () => {
        const cdetails = this.clientRef.current.getValue() || {};
        const { clientId } = cdetails;
        let payload = { query: { clientId } };
        this.searchRef.current.setQuery({ query: payload });
    }

    render() {
        const { onSelect, onClose, isPopUp = false, needSearch = true, query = {} } = this.props;
        const headings = ["Client Name", "Weft", "Stock", "Action"];
        const searchProps = {
            query: { query },
            url: "/service/clientweft/search",
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table", props: {
                        headings, row: SearchClientWeftRow,
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
                {needSearch ?
                    <div className="row m-0">
                        <div className="col">
                            <ClientPicker ref={this.clientRef} url={`${baseUrl}/${clientType}/search`} baseUrl={baseUrl} clientType={clientType} businessData={businessData} />
                        </div>
                        <div className="col-1 align-content-center">
                            <button className="btn btn-primary" onClick={this.onSearchFormClick}>Search</button>
                        </div>
                    </div>
                    : ""}
                <div className="row m-0">
                    <div className="col p-0">
                        <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
                    </div>
                </div>
            </div>
        );
    }
}

export const SearchClientWeft = (props) => {
    const { businessData } = useOutletContext();
    return <SearchClientWeftClass {...props} businessData={businessData} />
}