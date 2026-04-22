import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { Button } from "react-bootstrap";
import { LoomedClothApprove } from "./loomedClothApprove";
import { LoomedClothViewer } from "./loomedClothView";
import { convertToIST, convertToISTDate, isWithinNdays, utcStringToDate } from "../../utilities/timeUtils";
import { LoomedClothCancel } from "./cancel/LoomedClothCancel";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');

export class LoomedClothSearch extends React.Component {
    bgPickerRef = React.createRef(null);
    searchRef = React.createRef(null);
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    callZero = () => {
        this.searchRef.current?.callZero();
    }

    showLoomedClothView = (data) => {
        this.POPUP.current.showPopUp("Loomed Cloth Details", LoomedClothViewer, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark", css: { body: "p-0", footer: "visually-hidden" } }, props: { data } });
    }

    showLoomedClothApprove = (data) => {
        this.POPUP.current.showPopUp("Approve loomed cloth", LoomedClothApprove, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark", css: { body: "p-0", footer: "visually-hidden" } }, props: { data } });
    }

    showLoomedClothCancel = (data, action) => {
        this.POPUP.current.showPopUp("Cancel Loomed cloth", LoomedClothCancel, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { data, action } });
    }

    actionRendered = (keyval, fdata) => {
        const { status, updatedTime } = fdata;
        const res = [];
        res.push(<button className="btn btn-sm btn-outline-secondary" onClick={() => this.showLoomedClothView(fdata)}>View</button>);
        if (status === "RECEIVED") {
            res.push(<button className="btn btn-sm btn-outline-primary ms-1" onClick={() => this.showLoomedClothApprove(fdata)}>Approve</button>)
        }
        if ((status === "INSPECTED" && isWithinNdays(utcStringToDate(updatedTime), -3)) || status === "RECEIVED") {
            let buttonRef = React.createRef(null);
            const actionText = status === "INSPECTED" ? "Cancel" : "Remove";
            res.push(<button ref={buttonRef} className="btn btn-sm btn-outline-danger ms-1" onClick={() => this.showLoomedClothCancel(fdata, actionText)} >{actionText}</button>)
        }
        return res;
    };

    styleFunc = (data) => {
        const { status } = data;
        if (status === "REMOVED" || status === "CANCELLED") {
            return "text-decoration-line-through";
        }
        return "";
    }

    render() {
        const { isPopUp = false, url = "/service/loomed_cloth/search", query = {} } = this.props;
        const { group = {} } = this.state;
        const headings = ["Client Name", "Loom No", "Date", "Cost Type", "Cost", "Damaged Cost", "Received Length", "Actual Length", "Proper Length",
            "Damaged Length", "Proper Piece", "Damaged Piece", "Credit Amount", "Debit Amount", "Status", "Action"];
        const cells = [{ key: "clientLoom.client.name" }, { key: "clientLoom.number" }, { key: "createdTime", renderer: (keyval) => { return convertToISTDate(keyval) } }, { key: "costType" },
        { key: "cost" }, { key: "damageCost" }, { key: "loomedLength" }, { key: "actualLength" }, { key: "properLength" }, { key: "damagedLength" }, { key: "properPiece" }, { key: "damagedPiece" },
        { key: "creditAmount" }, { key: "debitAmount" }, { key: "status" }, { key: "", renderer: this.actionRendered }];
        const searchProps = {
            query: { query },
            url,
            views: [
                {
                    view: TableView,
                    iconStyle: "bi bi-table",
                    props: {
                        rowParam: { styleFunc: this.styleFunc },
                        headings,
                        cells,
                        style: "table table-striped table-sm table-hover",
                        headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.error(er); },
        };
        return (
            <div className="row m-0">
                <div className="col p-0">
                    <SearchCaller ref={this.searchRef} style="p-0" {...searchProps} />
                </div>
            </div>
        );
    }
}
