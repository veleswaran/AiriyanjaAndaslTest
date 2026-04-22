import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { ViewPurpose } from "./viewPurpose";


const TableView = GetAslModules("TableView");
const SearchCaller = GetAslModules("SearchCaller");
const ChipsSearch = GetAslModules("ChipsSearch");

export class SearchPurpose extends React.Component {
    filterRef = React.createRef(null)
    searchRef = React.createRef(null)
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

    showViewPurpose = (data) => {
        const { name } = data
        this.POPUP.current.showPopUp(`Details of ${name}`, ViewPurpose, "bg-info", { modalProps: { className: "bg-opacity-75 bg-dark", css: { footer: "visually-hidden", body: "p-0" } }, props: { data } });
    }

    actionRendered = (keyval, data) => {
        const { onSelect, onClose, isPopUp = false } = this.props;
        if (isPopUp) {
            return <button className="btn btn-sm btn-primary" onClick={() => { onSelect?.(data); onClose?.(); }}>select</button>
        }
        return <button className="btn btn-sm btn-outline-secondary" onClick={() => this.showViewPurpose(data)}>view</button>;
    }

    onSearchUpdate = () => {
        const query = this.filterRef.current.getValue();
        this.searchRef.current.setQuery({ query: { query } });
    }

    render() {
        const { css = "", style = {} } = this.props;
        const filters = { name: { count: 10 } };
        const searchProps = {
            query: { query: {} },
            url: "/service/purpose/search",
            views: [
                {
                    view: TableView,
                    iconStyle: "bi bi-table",
                    props: {
                        headings: ["Name", "Action"],
                        cells: [{ key: "name" }, { key: "deductions", renderer: this.actionRendered }],
                        headingCss: "position-sticky top-0 z-3"
                    },
                },
            ],
            result: { from: 0, data: [] },
            onError: (error) => console.error(error),
        };
        return <div className={css} style={style}>
            <div>
                <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search beam e.g number:1000" onUpdate={this.onSearchUpdate} />
            </div>
            <div className="mt-1">
                <SearchCaller ref={this.searchRef} {...searchProps} />
            </div>
        </div>;
    }
}