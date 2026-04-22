
import React from "react";
import { GetAslModules } from "../../utilities/utilities";
import { nameValidatorChips } from "../../clients/validators";
import { wildcardProcessor } from "../../utilities/searchUtilitiies";

const SearchCaller = GetAslModules("SearchCaller");
const TableView = GetAslModules("TableView");
const ChipsSearch = GetAslModules("ChipsSearch");

export class IdentifierSearch extends React.Component {
    searchRef = React.createRef();
    filterRef = React.createRef();

    constructor(props) {
        super(props);
    }

    onSearchUpdate = () => {
        const query = this.filterRef.current.getValue();
        this.searchRef.current.setQuery({ query: { query } });
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
    }
    render() {
        const { css = "", style = {} } = this.props;
        const searchProps = {
            query: { query: {} },
            url: "/service/identifier/search",
            views: [
                {
                    view: TableView,
                    iconStyle: "bi bi-table",
                    props: {
                        headings: ["Name", "Datatype", "Action"],
                        cells: [{ key: "name", }, { key: "dataType" }, { key: "Action", renderer: this.actionRendered }],
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
                    <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search name" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
                </div>
                <div className="mt-1">
                    <SearchCaller ref={this.searchRef} {...searchProps} />
                </div>
            </div>
        );
    }
}
