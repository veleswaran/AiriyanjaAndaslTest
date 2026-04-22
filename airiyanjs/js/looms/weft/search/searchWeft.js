import React from "react";
import { GetAslModules } from "../../../utilities/utilities";
import { SpecsMultiSelecter } from "../../../materials/products/specsName/specsMultiSelecter";
import { SearchWeftRow } from "./searchWeftRow";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');


export class SearchWeft extends React.Component {
    selectRef = React.createRef(null);
    searchRef = React.createRef(null);
    materialTypeRef = React.createRef(null);
    countRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    callZero = () => {
        this.searchRef.current?.callZero();
    }

    keyFunc = (data = []) => {
        const found = new Map();
        const headings = [];
        for (const item of data) {
            const { specDetails = [] } = item;
            for (const spec of specDetails) {
                const { specGroup: { name } = {} } = spec;
                if (!found.has(name)) {
                    found.set(name, true);
                    headings.push(name);
                }
            }
        }
        headings.sort();
        return headings;
    }

    headingFunc = (data = []) => {
        return [...this.keyFunc(data), "Stock", "Action"];;
    }

    preProcessor = (data) => {
        const headings = this.keyFunc(data);
        return { keys: headings };
    }

    updateSearch = (data) => {
        const specs = [];
        for (const spe of this.selectRef.current.getValue()) {
            const { id } = spe;
            specs.push(id);
        }
        this.searchRef.current.setQuery({ query: { query: { specs } } });
    }

    render() {
        const { onSelect, onClose, isPopUp = false } = this.props;
        const searchProps = {
            query: { query: {} },
            url: "/service/weft/search",
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table", props: {
                        row: SearchWeftRow, preProcessor: this.preProcessor,
                        headingFunc: this.headingFunc, rowParam: { others: { needSelect: isPopUp, onSelect, onClose } },
                        headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        return (
            <div className="row m-0 gap-1">
                <div className="col-3 p-0">
                    <SpecsMultiSelecter title="Select weft filter" ref={this.selectRef} onUpdate={this.updateSearch} css="rounded-end-0 bg-body-secondary" />
                </div>
                <div className="col p-0">
                    <SearchCaller ref={this.searchRef} style="p-0 rounded-start-0" {...searchProps}></SearchCaller>
                </div>
            </div>
        );
    }
}