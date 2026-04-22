import React from "react";
import { GetAslModules } from "../../utilities/utilities";
import { convertToIST } from "../../utilities/timeUtils";
import { dateValidator } from "../../clients/validators";

const SearchCaller = GetAslModules("SearchCaller");
const TableView = GetAslModules("TableView");
const ChipsSearch = GetAslModules("ChipsSearch")

export class FundSearch extends React.Component {
    searchRef = React.createRef();
    filterRef = React.createRef();

    constructor(props) {
        super(props);
    }

    onSearchUpdate = () => {
        const query = this.filterRef.current.getValue();
        this.searchRef.current.setQuery({ query: { query } });
    }

    actionRendered = (keyval, data) => {
        const { onSelect, onClose, isPopUp = false } = this.props;
        if (!isPopUp) return null;
        return (<button className="btn btn-primary btn-sm" onClick={() => { onSelect?.(data); onClose?.(); }} >Select</button>);
    };

    render() {
        const { css = "", style = {} } = this.props;

        const searchProps = {
            query: { query: {} },
            url: "/service/fund/search",
            views: [
                {
                    view: TableView,
                    iconStyle: "bi bi-table",
                    props: {
                        headings: ["Created Time", "Description", "Credit", "Debit", "Balance"],
                        cells: [
                            { key: "createdTime", renderer: (key, row) => convertToIST(key) },
                            { key: "description" },
                            { key: "amount", renderer: (key, row) => key > 0 ? <span className="text-success">{key}</span> : "" },
                            { key: "amount", renderer: (key, row) => key < 0 ? <span className="text-danger">{key}</span> : "" },
                            { key: "totalAmount" },
                        ],
                        headingCss: "position-sticky top-0 z-3"
                    },
                },
            ],
            result: { from: 0, data: [] },
            onError: (error) => console.error("Fund search failed:", error),
        };

        const filters = {
            fromDate: { type: "date", count: 1, validator: dateValidator },
            toDate: { type: "date", count: 1, validator: dateValidator }
        }

        return (
            <div className={"m-0 " + css} style={style}>
                <div className="p-0 mt-1">
                    <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search fromDate, toDate" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
                </div>
                <div className="p-0 mt-2">
                    <SearchCaller ref={this.searchRef} {...searchProps} />
                </div>
            </div>
        );
    }
}
