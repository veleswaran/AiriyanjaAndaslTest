import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { SearchForm } from "../../../common/SearchForm";
import { SearchConsumptionRow } from "./searchConsumptionRow";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');

export class SearchConsumption extends React.Component {
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

    onSearchFormClick = (data) => {
        let payload = { query: { name: data.data } };
        this.searchRef.current.setQuery({ query: payload });
    }

    render() {
        const { onSelect, onClose, isPopUp = false, query = {} } = this.props;
        const headings = ["Title", "Pick", "Sampled/Piece Length(metre)", "Width (inch)", "Reed", "Cost Type", "Cost", "Damage Cost", "Action"];
        const searchProps = {
            query: { query },
            url: "/service/consumptions/search",
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table", props: {
                        headings, row: SearchConsumptionRow,
                        rowParam: { others: { needSelect: isPopUp, onSelect, onClose } }, headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        return (
            <div>
                <div className="row m-0">
                    <SearchForm searchTitle="Search Beam group by" radios={['NAME']} onClick={this.onSearchFormClick}></SearchForm>
                </div>
                <div className="row m-0 mt-1">
                    <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
                </div>
            </div>
        );
    }
}