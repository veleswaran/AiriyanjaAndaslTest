import React from "react";
import { GetAslModules } from "../../utilities/utilities";
import { importASL } from "../../utilities/utilities";
import { SearchForm } from "../../common/SearchForm";
import { Button } from "react-bootstrap";
import { SearchBeamGroupRow } from "./search/searchBeamGroupRow";
import { AddBeamGroup } from "./addBeamGroup";
import { SpecsMultiSelecter } from "../../materials/products/specsName/specsMultiSelecter";
const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const TitledText = GetAslModules("TitledTextBox");

export class SearchBeamGroup extends React.Component {
    searchRef = React.createRef(null);
    groupNameRef = React.createRef(null);
    specsRef = React.createRef(null);
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
        return ["Name", ...this.keyFunc(data), "Action"];;
    }

    preProcessor = (data) => {
        const headings = this.keyFunc(data);
        return { keys: headings };
    }

    onSearchFormClick = (data) => {
        let payload = { query: { name: data.data } };
        this.searchRef.current.setQuery({ query: payload });
    }
    onFilterChange = () => {
        const specs = this.specsRef.current?.getValue().map(item => Number(item.id));
        const name = this.groupNameRef.current?.getValue() || "";
        let payload = { query: { name, specs } };
        this.searchRef.current.setQuery({ query: payload });
    }

    actionRendered = (keyval, data) => {
        const { onSelect, onClose, isPopUp = false } = this.props;
        if (isPopUp) {
            return <Button variant="primary" onClick={() => {
                if (onSelect) {
                    onSelect(data)
                }
                if (onClose) {
                    onClose();
                }
            }}>select</Button>
        }
        return "";
    }


    showAddGroup = () => {
        this.POPUP.current?.showPopUp("Add Beam Group", AddBeamGroup, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSuccess: this.callZero } });
    }

    render() {
        const { onSelect, onClose, isPopUp = false } = this.props;
        const searchProps = {
            query: { query: {} },
            url: "/service/beamgroup/search",
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table", props: {
                        style: "table table-striped table-sm table-hover", row: SearchBeamGroupRow, preProcessor: this.preProcessor,
                        headingFunc: this.headingFunc, rowParam: { others: { needSelect: isPopUp, onSelect, onClose } }, headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        return (
            <div>
                <div className="row m-0">
                    {
                        !isPopUp ? <div className="col-1 col-sm-auto align-content-center">
                            <button className="btn btn-success" onClick={this.showAddGroup}>Add Group</button>
                        </div> : ""
                    }
                </div>
                <div className="row m-0 mt-1">
                    <div className="col-3 p-0">
                        <TitledText ref={this.groupNameRef} placeholder="Group Name" type="text" class="mb-1" onChange={this.onFilterChange} />
                        <SpecsMultiSelecter title="Select filters" ref={this.specsRef} onUpdate={this.onFilterChange} css="rounded-end-0 bg-body-secondary" />
                    </div>
                    <div className="col p-0 ms-1">
                        <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
                    </div>
                </div>
            </div>
        );
    }
}
