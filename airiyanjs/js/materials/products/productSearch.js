import React from "react";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { SpecsMultiSelecter } from "./specsName/specsMultiSelecter";
import { getProductColKeys } from "./utilities";
import { ProductRow } from "./productRow";
import { CommodityPicker } from "../commodity/commodityPicker";
import { nameValidatorChips } from "../../clients/validators";
import { wildcardProcessor } from "../../utilities/searchUtilitiies";
import { SearchSpecsName } from "./specsName/searchSpecsName";
import { CommoditySearch } from "../commodity/commoditySearch";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const ChipsSearch = GetAslModules("ChipsSearch");

export class ProductSearch extends React.Component {
    specsRef = React.createRef(null);
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

    preProcessor = (data) => {
        return getProductColKeys(data);
    }

    callZero = () => {
        this.searchRef.current?.callZero();
    }

    headingFunc = (data) => {
        const { specsKeys } = getProductColKeys(data);
        const res = ["PID", "Product Name", ...specsKeys, "Units", "Stock", "Price", "Tax", "Action"];
        return res;
    }

    onSearchUpdate = () => {
        const searchChips = this.filterRef.current.getValue();
        this.searchRef.current.setQuery({ query: { query: searchChips } });
    }

    render() {
        const { css = "", style = {}, onSelect, onClose, isPopUp = false, query = {}, needFilters = true, businessData = {} } = this.props;
        const searchProps = {
            query: { query },
            url: "/service/product/search" + (isPopUp ? "/enabled" : ""),
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table", props:
                    {
                        headingFunc: this.headingFunc, row: ProductRow, preProcessor: this.preProcessor,
                        rowParam: { others: { needSelect: isPopUp, onSelect, onClose, businessData } },
                        style: "table table-striped table-hover m-0 table-sm",
                        headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        const filters = {
            name: { count: 10, validator: nameValidatorChips, valueProcessor: wildcardProcessor, type: "nonkey" },
            pid: { count: 10, type: "pint", filterKey: "localId" },
            specs: {
                type: "poper", count: 8, filterKey: "specsNameId",
                poper: {
                    select: { component: SearchSpecsName, title: "Select Specs Name", modalProps: { size: "xl", className: "bg-opacity-75 bg-dark" } },
                    view: { component: ({ name, specGroup: { name: group_name } = {} }) => { return <span>{name} (<small>{group_name}</small>)</span>; }, title: "Selected Specs Name" },
                    display: { component: ({ name, specGroup: { name: group_name } = {} }) => { return <span>{name} (<small>{group_name}</small>)</span>; } }
                },
                valueProcessor: (data) => data.id,
            },
            commodity: {
                type: "poper", count: 8, filterKey: "commodityId",
                poper: {
                    select: { component: CommoditySearch, title: "Select Commodity", modalProps: { size: "xl", className: "bg-opacity-75 bg-dark" } },
                    view: { component: ({ name }) => { return name; }, title: "Selected Commodity" },
                    display: { component: ({ name }) => { return name; } }
                },
                valueProcessor: (data) => data.id,
            }
        };
        return (
            <div className={"m-0 " + css} style={style}>
                <div className="p-0">
                    <div className="mb-1">
                        {needFilters ? <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search products e.g pid:1" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} /> : ""}
                    </div>
                    <SearchCaller ref={this.searchRef} {...searchProps} />
                </div>
            </div>
        );
    }
}