import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { SearchForm } from "../../common/SearchForm";
import { Button } from "react-bootstrap";
import { RESULT_SUCCESS } from "../../globals/constants";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');
const PostButton = GetAslModules("PostButton");

export class SearchClientBeams extends React.Component {
    bgPickerRef = React.createRef(null);
    searchRef = React.createRef(null);
    addBeamRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = {};
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onCompleteError = () => {
        this.TOAST.current?.showFailed("Somthing went wrong", message || "Unknown error");
    }

    onCompleteSuccess = (rData) => {
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current.showSuccess("Success", "Beam Completed sucessfully");
        } else {
            this.TOAST.current?.showFailed("Unable to cancel", message || "Unknown error");
        }
    }

    actionRendered = (keyval, data) => {
        const { onSelect, onClose, isPopUp = false, needSearch = true } = this.props;
        if (isPopUp && needSearch) {
            return <>
                <Button size="sm" variant="primary-outline" onClick={(e) => {
                    if (onSelect) {
                        onSelect(data);
                        e.target.classList.toggle('visually-hidden');
                    }
                }}>Add</Button>
                <Button size="sm" className="ms-1" variant="secondary-outline" onClick={() => {
                    if (onSelect) {
                        onSelect(data)
                    }
                    if (onClose) {
                        onClose();
                    }
                }}>select</Button>
            </>
        }
        const { status, receivedLength, loomedLength, clientId, id } = data
        if (status === "IN_STOCK" && loomedLength >= receivedLength) {
            return <PostButton url="/service/clientbeam/complete" valueGetter={() => { return { clientId, clientBeamId: id } }}
                onSuccess={this.onCompleteSuccess} onError={this.onCompleteError} varient="outlined" css="btn-outline-dark">
                Complete Beam
            </PostButton>;
        }
        return "";
    }

    setClientId = (clientId) => {
        const payload = { query: { clientId } };
        this.searchRef.current.setQuery({ query: payload });
    }

    onSearchFormClick = (data) => {
        const { group: { id } = {} } = this.state;
        const payload = { query: { number: data.data, groupId: id } };
        this.searchRef.current.setQuery({ query: payload });
        this.state.number = data.data;
    }

    render() {
        const { url = "/service/clientbeam/search", needSearch = true, query = {} } = this.props;
        const headings = ["UID", "Number(user)", "Client Name", "Group", "inloom", "Status", "Received Length", "Loomed length", "Remaining Length", "Number of threads", "Action"];
        const cells = [{ key: "beam.uid" }, { key: "beam.number" }, { key: "client.name" }, { key: "beam.group.name" }, { key: "clientLoom.number" }, { key: "status" }, { key: "receivedLength" },
        { key: "loomedLength" }, { key: "receivedLength", renderer: (kv, dta) => { return kv - dta.loomedLength; } }, { key: "beam.threadCount" },
        { key: "", renderer: this.actionRendered }];
        const searchProps = {
            query: { query },
            url,
            views: [
                { view: TableView, iconStyle: "bi bi-table", props: { style: "table table-striped table-hover m-0 small", headings, cells, headingCss: "position-sticky top-0 z-3" } }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        return (<div>
            {needSearch ?
                <div className="row">
                    <div className="col">
                        <SearchForm searchTitle="Search Beam by" radios={['BeamId']} onClick={this.onSearchFormClick}></SearchForm>
                    </div>
                </div>
                : ""}
            <div className="row">
                <div className="col">
                    <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
                </div>
            </div>
        </div>
        );
    }
}