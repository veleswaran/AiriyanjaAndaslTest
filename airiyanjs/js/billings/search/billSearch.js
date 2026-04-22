import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { SearchDateForm } from "../SearchDateForm";
import { BillSearchRow } from "./billSearchRow";
import { toHex, toJsonString } from "../../utilities/objectUtils";
import { dateValidator, nameValidator } from "../../clients/validators";
import { ClientSearch } from "../../clients/clientSearch";
import { wildcardProcessor } from "../../utilities/searchUtilitiies";
import { ClientView } from "../../clients/clientView";

const SearchCaller = GetAslModules("SearchCaller");
const TableView = GetAslModules("TableView");
const ChipsSearch = GetAslModules("ChipsSearch");

export class BillSearch extends React.Component {
    searchRef = React.createRef();
    formRef = React.createRef();
    filterRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = { filters: {}, };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onSearchUpdate = () => {
        const query = this.filterRef.current.getValue();
        this.searchRef.current.setQuery({ query: { query } });
    }

    onDisplay = ({ billingName }) => {
        return <em>{billingName}</em>
    }

    onView = ({ data }) => {
        return <ClientView client={data} clientDetail={data} buttonNeeded={false} css="card rounded-0" />;
    }

    onPrintClick = () => {
        const { printUrl = "/" } = this.props;
        const data = this.formRef.current.getValue();
        this.setState({ filters: data }, () => {
            this.applyFilters();
            const query = this.getFilters();
            const json = toJsonString(query);
            const hex = toHex(json);
            window.open(printUrl + "?data=" + hex, "_blank");
        });
    }

    applyFilters = () => {
        const query = this.getFilters();
        this.searchRef.current?.setQuery({ query: { query } });
    };

    render() {
        const { url = "", clientUrl = "", css = "", style = {}, printNeeded = false, isPopUp = false, onSelect, onClose } = this.props;
        const filters = {
            billNumber: { count: 1, validator: billNumberValidator, valueProcessor: wildcardProcessor },
            fromDate: { type: "date", count: 1, validator: dateValidator },
            toDate: { type: "date", count: 1, validator: dateValidator },
            client: {
                type: "poper", count: 1, filterKey: "clientId", tooltip: "press v show client details, others edit",
                poper: {
                    select: {
                        component: ClientSearch,
                        title: "Select Client",
                        modalProps: { size: "xl", className: "bg-opacity-75 bg-dark" },
                        props: { url: clientUrl }
                    },
                    view: { component: this.onView, title: "Selected Client", modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }},
                    display: { component: this.onDisplay }
                },
                valueProcessor: (data) => data.clientId,
            }
        }

        const searchProps = {
            query: { query: {} },
            url,
            views: [
                {
                    view: TableView,
                    iconStyle: "bi bi-table",
                    props: {
                        headings: ["Bill Number", "Bill to", "Bill Date", "Amount", "Status", "Action"],
                        row: BillSearchRow,
                        rowParam: { others: { needSelect: isPopUp, onSelect, onClose } },
                        style: "table table-striped table-sm table-hover",
                        headingCss: "position-sticky top-0 z-3 "
                    },
                },
            ],
            result: { from: 0, data: [] },
            onError: (error) => console.error(error),
        };

        return (
            <div className={"row m-0 " + css} style={style}>
                <div className="col-12 mt-2 p-0">
                    <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search billNumber, fromDate, toDate, client" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
                </div>
                <div className="col-12 mt-2 p-0">
                    <SearchCaller ref={this.searchRef} {...searchProps} />
                </div>
            </div>
        );
    }
}

function billNumberValidator(data) {
    if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length < 1 || data.length > 10) {
        return false;
    }
    return true;
}

export const SalesBillSearch = function (props) {
    return <BillSearch {...props} url="/service/bill/SALES/search" clientUrl="/service/client/SALES/search" printUrl="/sales/printallbill" printNeeded={true} />;
};

export const SalesDcSearch = function (props) {
    return <BillSearch {...props} url="/service/bill/SALES_DC/search" clientUrl="/service/client/SALES/search" printUrl="/sales/printallFYDC" printNeeded={true} />;
};

export const SalesJobWorkSearch = function (props) {
    return <BillSearch {...props} url="/service/bill/JOB_WORK/search" clientUrl="/service/client/SALES/search" printUrl="/sales/printallFYJW" printNeeded={true} />;
};

export const SalesCreditNoteSearch = function (props) {
    return <BillSearch {...props} url="/service/bill/CREDIT_NOTE/search" clientUrl="/service/client/SALES/search" printUrl="/sales/printallFYCT" printNeeded={true} />;
};

export const purchaseBillSearch = function (props) {
    return <BillSearch {...props} url="/service/bill/PURCHASE/search" clientUrl="/service/client/PURCHASE/search" />;
};

export const purchaseDebitNoteSearch = function (props) {
    return <BillSearch {...props} url="/service/bill/DEBIT_NOTE/search" clientUrl="/service/client/PURCHASE/search" />;
};
