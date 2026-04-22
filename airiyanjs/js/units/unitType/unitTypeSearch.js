import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { nameValidatorChips } from "../../clients/validators";
import { wildcardProcessor } from "../../utilities/searchUtilitiies";

const SearchCaller = GetAslModules("SearchCaller");
const TableView = GetAslModules("TableView");
const PostTButton = GetAslModules("PostTButton");
const ChipsSearch = GetAslModules("ChipsSearch")

export class UnitTypeSearch extends React.Component {
    searchRef = React.createRef();
    filterRef = React.createRef();
    constructor(props) {
        super(props);
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

    onEnabled = () => {
        this.TOAST.current?.showSuccess("Success", "Enabled status changed successfully");
    }
    onEnabledFailed = (error) => {
        this.TOAST.current?.showFailed("Error", "Failed to change enabled status");
    }

    actionRendered = (keyval, data) => {
        const { onSelect, onClose, isPopUp = false } = this.props;
        if (isPopUp) {
            return <button className="btn btn-primary" onClick={() => {
                if (onSelect) {
                    onSelect(data)
                }
                if (onClose) {
                    onClose();
                }
            }}>select</button>
        }
        return (
            <PostTButton
                url="/service/unit/change_enabled"
                valueGetter={() => { return { id: data.id, enabled: !data.enabled } }}
                onSuccess={this.onEnabled}
                onError={this.onEnabledFailed}
                checked={data.enabled}
                lvarient="d-none"
            >
                Enable
            </PostTButton>
        );
    }
    render() {
        const { css = "", style = {} } = this.props;
        const searchProps = {
            query: { query: {} },
            url: "/service/unit/search",
            views: [
                {
                    view: TableView,
                    iconStyle: "bi bi-table",
                    props: {
                        headings: ["Name", "Action"],
                        cells: [{ key: "name", }, { key: "Action", renderer: this.actionRendered }],
                        headingCss: "position-sticky top-0 z-3"
                    },
                },
            ],
            result: { from: 0, data: [] },
            onError: (error) => console.error(error),
        };
        const filters = { name: { count: 8, validator: nameValidatorChips, type: "nonkey", valueProcessor: wildcardProcessor } }

        return (
            <div className={css} style={style}>
                <div>
                    <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search Name" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
                </div>
                <div className="mt-1">
                    <SearchCaller ref={this.searchRef} {...searchProps} />
                </div>
            </div>
        );
    }
}
