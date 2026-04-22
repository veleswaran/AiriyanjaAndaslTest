import React from "react";
import { GetAslModules } from "../utilities/utilities";
import { Button } from "react-bootstrap";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');

export class TaxSearch extends React.Component {
    searchRef = React.createRef(null);
    constructor(props) {
        super(props)
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

    render() {
        const { css = "", style = {} } = this.props;
        const headings = ["Name", "Action"];
        const cells = [{ key: "type" }, { key: "", renderer: this.actionRendered }];
        const searchProps = {
            query: { query: {} },
            url: "/service/tax/search",
            views: [
                { view: TableView, iconStyle: "bi bi-table", props: { headings, cells, headingCss: "position-sticky top-0 z-3" } }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        return (
            <div className={css} style={style}>
                <SearchCaller ref={this.searchRef} style="p-0" {...searchProps}></SearchCaller>
            </div >
        );
    }
}