import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { ChallanSearchRow } from "./search/challanSearchRow";

const ChipsSearch = GetAslModules("ChipsSearch");
const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');

export class SearchClothChallan extends React.Component {
    searchRef = React.createRef(null);
    filterRef = React.createRef(null);
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

    onSearchUpdate = () => {
        const searchChips = this.filterRef.current.getValue();
        const payload = { query: searchChips };
        this.searchRef.current.setQuery({ query: payload });
    }

    render() {
        const { css = "", style = {} } = this.props;
        const headings = ["Receipt Number", "Receipt Date", "Client Name", "Added Date", "Total Wage", "Deduction", "Payable", "Debit", "Status", "Action"];
        const searchProps = {
            query: { query: {} },
            url: "/service/clothchallan/search",
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table",
                    props: {
                        row: ChallanSearchRow, headings, style: "table table-striped table-sm table-hover",
                        headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.error(er); },
        };
        const filters = {
            number: { type: "pint", count: 10 },
            year: { type: "pint", count: 10 }
        };
        return (
            <div className={css} style={style}>
                <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search challan e.g name:number" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
                <SearchCaller ref={this.searchRef} style="mt-1 p-0" {...searchProps} />
            </div>
        );
    }
}