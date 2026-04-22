import React from "react";
import { Button } from "react-bootstrap";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { AddressViewer } from "../addressViewer";
import { formateAmount } from "../../utilities/uiUtils";

const SearchCaller = GetAslModules("SearchCaller");
const TableView = GetAslModules("TableView");
export class OutStandingBills extends React.Component {
    searchRef = React.createRef();

    constructor(props) {
        super(props);
    }
    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    actionRendered = (keyval, data) => {
        const notes = data.notes
        let { method, name = "Customer Details" } = this.props
        return (
            <Button onClick={async () => {
                const comProps = { data, method, };
                this.POPUP.current.showPopUp(name, AddressViewer, 'bg-warning', { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: comProps });
            }} >View</Button>
        );
    }
    render() {
        const { url = "", css = "", style = {} } = this.props;
        const searchProps = {
            query: { query: {} },
            url,
            views: [
                {
                    view: TableView,
                    iconStyle: "bi bi-table",
                    props: {
                        headings: ["Name", "Mobile", "Notes", "Balance", "Action"],
                        cells: [
                            { key: "name", },
                            { key: "mobile", renderer: (_, row) => row.details?.[0]?.detailData?.MOBILE ?? "" },
                            { key: "notes" }, { key: "amount", renderer: formateAmount },
                            { key: "Action", renderer: this.actionRendered }],
                        headingCss: "position-sticky top-0 z-3"
                    },
                },
            ],
            result: { from: 0, data: [] },
            onError: (error) => console.error(error),
        };

        return (
            <div className={css} style={style}>
                <div className="mt-1">
                    <SearchCaller ref={this.searchRef} {...searchProps} />
                </div>
            </div>
        );
    }
}

export const salesOutstanding = function (props) {
    return <OutStandingBills {...props} url="/service/client/SALES/outstanding" method="SALES" name="Customer Sales Details" />
};

export const purchaseOutstanding = function (props) {
    return <OutStandingBills {...props} url="/service/client/PURCHASE/outstanding" method="PURCHASE" name="Customer Purchase Details" />
};
