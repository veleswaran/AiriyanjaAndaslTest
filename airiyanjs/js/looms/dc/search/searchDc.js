import React from "react";
import { useOutletContext } from "react-router-dom";
import { importASL, GetAslModules } from "../../../utilities/utilities";
import { SearchDcRow } from "./searchDcRow";
import { ClientPicker } from "../../../clients/clientPicker";
import { ViewDc } from "../viewDc";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const TitledTextBox = GetAslModules("TitledTextBox");

export class SearchChallan extends React.Component {
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

    onTextChange = (number) => {
        const { query = {} } = this.props;
        const { clientId } = this.clientRef.current.getValue() || {};
        let payload = { query: { number, ...query } };
        if (clientId > 0) {
            payload.query.clientId = clientId;
        }
        this.searchRef.current.setQuery({ query: payload });
    }

    onClientSelected = (data) => {
        const { query = {} } = this.props;
        const { clientId } = data || {};
        const number = this.textRef.current.getValue() || "";
        let payload = { query: { number, ...query } };
        if (clientId > 0) {
            payload.query.clientId = clientId;
        }
        this.searchRef.current.setQuery({ query: payload });
    }

    render() {
        const { onSelect, onClose, isPopUp = false, query = {} } = this.props;
        const headings = ["Number", "client Name", "Time", "status", "Type", "Notes", "Action"];
        const searchProps = {
            query: { query },
            url: "/service/dc/search",
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table", props: {
                        headings, row: SearchDcRow,
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
                        <TitledTextBox ref={this.textRef} placeholder={"Number"} onChange={this.onTextChange} />
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


export function SearchDC(props) {
    const { businessData } = useOutletContext();
    return <SearchChallan {...props} query={{ type: "DELIVERY" }} businessData={businessData} />
}

export function SearchRC(props) {
    const { businessData } = useOutletContext();
    return <SearchChallan {...props} query={{ type: "RETURN" }} businessData={businessData} />
}