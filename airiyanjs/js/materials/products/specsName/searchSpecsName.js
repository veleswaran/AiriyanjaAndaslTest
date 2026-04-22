import React from "react";
import { GetAslModules } from "../../../utilities/utilities";
import { importASL } from "../../../utilities/utilities";
import { Button } from "react-bootstrap";
import { SgToggle } from "../specsGroup/SgToggle";
import { nameValidatorChips } from "../../../clients/validators";
import { wildcardProcessor } from "../../../utilities/searchUtilitiies";
import { SearchSpecsGroup } from "../specsGroup/SearchSpecsGroup";
import { ClientView } from "../../../clients/clientView";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const ChipsSearch = GetAslModules("ChipsSearch");

export class SearchSpecsName extends React.Component {
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

    onSearchFormClick = (data) => {
        const payload = { type: data.key, query: { [data.key]: data.data } };
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

    onSearchUpdate = () => {
        const searchChips = this.filterRef.current.getValue();
        this.searchRef.current.setQuery({ query: { query: searchChips } });
    }

    onDisplay = ({ name }) => {
        return <em>{name}</em>
    }

    onView = ({ data }) => {
        return <ClientView client={data} clientDetail={data} buttonNeeded={false} css="card rounded-0" />;
    }

    render() {
        const { isPopUp = false } = this.props;
        const headings = ["Name", "Group Name"];
        const cells = [{ key: "name" }, { key: "specGroup.name" }];
        if (isPopUp) {
            headings.push("Action");
            cells.push({ key: "", renderer: this.actionRendered });
        } else {
            headings.push("Enabled");
            cells.push({ key: "enabled", renderer: (checked, { id } = {}) => <SgToggle url="/service/specs_name/change_enabled" data={{ checked, id }} /> })
        }
        const searchProps = {
            query: { query: {} },
            url: "/service/specs_name/search" + (isPopUp ? "/enabled" : ""),
            views: [
                { view: TableView, iconStyle: "bi bi-table", props: { headings, cells, headingCss: "position-sticky top-0 z-3" } }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        const filters = {
            groupName: { count: 8, validator: nameValidatorChips, valueProcessor: wildcardProcessor },
            specsName: { count: 8, validator: nameValidatorChips, valueProcessor: wildcardProcessor, type: "nonkey" },
            group: {
                type: "poper", count: 8, filterKey: "groupId",
                poper: {
                    select: { component: SearchSpecsGroup, title: "Select Specs Group", modalProps: { size: "xl", className: "bg-opacity-75 bg-dark" } },
                    view: { component: this.onView, title: "Selected Specs Group", modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" } },
                    display: { component: this.onDisplay, }
                },
                valueProcessor: (data) => data.id,
            },
        };
        return (
            <div className="">
                <div>
                    <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search Specs name, group e.g name:test" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
                </div>
                <div className="mt-1">
                    <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
                </div>
            </div >
        );
    }
}