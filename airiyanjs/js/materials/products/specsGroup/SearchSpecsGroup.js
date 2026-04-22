import React, { Component } from "react";
import { SearchForm } from "../../../common/SearchForm";
import { GetAslModules } from "../../../utilities/utilities";
import { SgToggle } from "./SgToggle";
import { Button } from "react-bootstrap";
import { nameValidatorChips } from "../../../clients/validators";
import { wildcardProcessor } from "../../../utilities/searchUtilitiies";
const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const ChipsSearch = GetAslModules("ChipsSearch");

function getTableConfig(needSelect, onClose, onSelect) {
    const headings = ["Name"];
    const cells = [{ key: "name" }];
    if (needSelect) {
        headings.push("Action");
        cells.push({
            key: "id", renderer: (keyVal, data) => {
                const onc = () => {
                    if (onSelect) {
                        onSelect(data);
                    }
                    if (onClose) {
                        onClose();
                    }
                }
                return <Button variant="primary" onClick={onc}>Select</Button>
            }
        });
    } else {
        headings.push("Visible in bill", "View as column", "Enabled");
        cells.push(
            { key: "isVisible", renderer: (checked, { id } = {}) => <SgToggle url="/service/specs_group/change_visibility" data={{ checked, id }} /> },
            { key: "viewAsColumn", renderer: (checked, { id } = {}) => <SgToggle url="/service/specs_group/change_view_as_column" data={{ checked, id }} /> },
            { key: "enabled", renderer: (checked, { id } = {}) => <SgToggle url="/service/specs_group/change_enabled" data={{ checked, id }} /> })
    }
    return { headings, cells };
}

export class SearchSpecsGroup extends React.Component {
    searchRef = React.createRef(null);
    filterRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    onSearchUpdate = () => {
        const searchChips = this.filterRef.current.getValue();
        this.searchRef.current.setQuery({ query: { query: searchChips } });
    }

    callZero = () => {
        this.searchRef.current?.callZero();
    }

    render() {
        const { isPopUp = false, onClose, onSelect } = this.props;
        const { headings, cells } = getTableConfig(isPopUp, onClose, onSelect);
        const filters = {
            name: { type: "nonkey", count: 10, validator: nameValidatorChips, valueProcessor: wildcardProcessor },
        }
        const searchProps = {
            query: { query: {} },
            url: "/service/specs_group/search",
            views: [
                { view: TableView, iconStyle: "bi bi-table", props: { headings, cells, headingCss: "position-sticky top-0 z-3" } }
            ],
            onError: (er) => { console.log(er); },
        };
        return (
            <div className="">
                <div>
                    <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search (e.g. Name)" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
                </div>
                <div className="mt-1">
                    <SearchCaller style="p-2" ref={this.searchRef} {...searchProps}></SearchCaller>
                </div>
            </div>
        );
    }
}
