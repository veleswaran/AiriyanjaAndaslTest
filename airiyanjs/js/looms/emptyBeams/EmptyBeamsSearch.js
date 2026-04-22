import React from "react";
import { useOutletContext } from "react-router-dom";
import { GetAslModules } from "../../utilities/utilities";
import { ClientPicker } from "../../clients/clientPicker";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');

export class EmptyBeamsSearchClass extends React.Component {
    searchRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = {};
    }

    actionRendered = (keyval, data) => {
        const { onSelect, onClose, isPopUp = false } = this.props;
        if (isPopUp) {
            return <>
                <button className="ms-1 btn btn-sm btn-outline-secondary" onClick={() => {
                    onSelect?.(data)
                    onClose?.();
                }}>select</button>
            </>
        }
        return "";
    }

    onSelected = (selected, client) => {
        const { clientId } = selected;
        let payload = { query: { clientId } };
        this.searchRef.current.setQuery({ query: payload });
    }

    render() {
        const { query = {}, needSearch = true } = this.props;
        const headings = ["Client Name", "Empty Beam", "Action"];
        const cells = [{ key: "client.name" }, { key: "emptyCount" }, { key: "", renderer: this.actionRendered }];
        const searchProps = {
            query: { query },
            url: "/service/emptybeam/search",
            views: [
                { view: TableView, iconStyle: "bi bi-table", props: { style: "table table-striped table-hover m-0 small", headings, cells } }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        const { baseUrl = "/service/client", clientType = "PURCHASE", businessData = {} } = this.props;
        return (<div>
            {needSearch ?
                <div className="row m-0">
                    <div className="col">
                        <ClientPicker ref={this.clientRef} url={`${baseUrl}/${clientType}/search`} baseUrl={baseUrl} clientType={clientType} businessData={businessData} onSelect={this.onSelected} />
                    </div>
                </div>
                : ""}
            <div className="row">
                <div className="col">
                    <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
                </div>
            </div>
        </div>);
    }
}

export const EmptyBeamsSearch = (props) => {
    const { businessData } = useOutletContext();
    return <EmptyBeamsSearchClass {...props} businessData={businessData} />
}