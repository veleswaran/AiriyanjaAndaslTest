import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { Button } from "react-bootstrap";
import { BeamGroupPicker } from "../beamgroups/beamGroupPicker";
import { AddBeams } from "./addBeams";
import { objectToQueryString } from "../../utilities/objectUtils";
import { AddBulk } from "./adding/addBulk";
import { RESULT_SUCCESS } from "../../globals/constants";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const PostButton = GetAslModules("PostButton");
const ChipsSearch = GetAslModules("ChipsSearch");

export class SearchBeams extends React.Component {
    bgPickerRef = React.createRef(null);
    searchRef = React.createRef(null);
    addBeamRef = React.createRef(null);
    filterRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = {};
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    showAdding = () => {
        const { group } = this.state;
        const { name } = group;
        this.POPUP.current?.showPopUp("Add Beam for - " + name, AddBeams, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { group, onSuccess: this.onAddSuccess } });
    }

    showBulkAdding = () => {
        const { group } = this.state;
        const { name } = group;
        this.POPUP.current?.showPopUp("Add bulk Beam for - " + name, AddBulk, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { group, onSuccess: this.onAddSuccess } });
    }

    onAddSuccess = () => {
        this.searchRef.current?.callZero();
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
        } else {
            const { status, enabled, id } = data;
            let buttonRef = React.createRef(null);
            const cancelProps = {
                url: "/service/beam/cancel",
                onError: () => {
                    this.TOAST.current.showFailed("Something went wrong", "Unable to cancel the beam");
                },
                onSuccess: (data) => {
                    if (data.result === RESULT_SUCCESS) {
                        this.TOAST.current.showSuccess("Success", "Beam cancelled successfully");
                        if (buttonRef.current) {
                            buttonRef.current.setDisabled(true);
                        }
                        return;
                    } else {
                        this.TOAST.current.showFailed("Error", data.message);
                    }
                },
                valueGetter: () => ({ id }),
            };
            if (status === 'IN_STOCK' && enabled) {
                return <PostButton ref={buttonRef} key="cancel" varient="outline-danger" size="sm" {...cancelProps} needConfirmation confirmMessage="Are you sure to Cancel this Beam?" css="ms-1">Cancel</PostButton>
            }
        }
        return "";
    }

    onSearchFormClick = (data) => {
        const { group: { id } = {} } = this.state;
        const payload = { query: { number: data.data, groupId: id } };
        this.searchRef.current.setQuery({ query: payload });
        this.state.number = data.data;
    }

    onBgSelect = (group) => {
        this.setState({ group });
        const { id } = group;
        const searchChips = this.filterRef.current.getValue();
        const payload = { query: { groupId: id, ...searchChips } };
        this.searchRef.current.setQuery({ query: payload });
    }

    onSearchUpdate = () => {
        const { group: { id } = {} } = this.bgPickerRef.current.getValue();
        const searchChips = this.filterRef.current.getValue();
        const payload = { query: { groupId: id, ...searchChips } };
        this.searchRef.current.setQuery({ query: payload });
    }

    numberRenderer = (keyVal, data) => {
        const { group: { name }, length, threadCount, width } = data;
        const qryString = objectToQueryString({ uid: keyVal, group: name, length, threadCount, width });
        return <span><i class="bi bi-printer me-1 btn btn-sm btn-outline-secondary" onClick={() => {
            window.open("/loom/printqr?" + qryString, "_blank");
        }} ></i>{keyVal}</span>;
    }

    render() {
        const { isPopUp = false, url = "/service/beam/search" } = this.props;
        const { group = {} } = this.state;
        const headings = ["UID", "Number", "Group Name", "Status", "Length (M)", "Width (Inch)", "Ends", "Loomed Length (M)", "Remaining (M)", "Action"];
        const cells = [{ key: "uid", renderer: this.numberRenderer }, { key: "number" }, { key: "group.name" }, { key: "status" },
        { key: "length" }, { key: "width" }, { key: "threadCount" }, { key: "loomedLength" }, { key: "length", renderer: (kv, dta) => { return kv - dta.loomedLength; } },
        { key: "", renderer: this.actionRendered }];
        const searchProps = {
            query: { query: {} },
            url,
            views: [
                { view: TableView, iconStyle: "bi bi-table", props: { headings, cells, style: "table table-striped table-sm table-hover", headingCss: "position-sticky top-0 z-3" } }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        const showAdd = !(isPopUp || group == {} || Object.keys(group) <= 0);
        const filters = {
            number: { count: 10 },
            width: { type: "pdecimal", count: 10 },
            length: { type: "pdecimal", count: 10 },
            uid: { type: "pint", count: 10 },
            ends: { type: "pint", filterKey: "threadCount", count: 10 }
        };
        return (<>
            <div className="row m-0 mb-1">
                <div className="col align-content-center p-0" style={showAdd ? {} : { display: 'none' }}>
                    <button className="btn btn-outline-dark bi bi-plus-circle-fill" onClick={this.showAdding}> Add</button>
                    <button className="ms-1 btn btn-outline-dark bi bi-plus-circle-fill" onClick={this.showBulkAdding}> Add bulk</button>
                </div>
            </div>
            <div className="row m-0">
                <div className="col-3 p-0">
                    <BeamGroupPicker ref={this.bgPickerRef} onSelect={this.onBgSelect} />
                </div>
                <div className="col ms-1">
                    <div className="row">
                        <div className="col p-0">
                            <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search beam e.g number:1000" onUpdate={this.onSearchUpdate} />
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col p-0">
                            <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
                        </div>
                    </div>
                </div>
            </div >
        </>
        );
    }
}
