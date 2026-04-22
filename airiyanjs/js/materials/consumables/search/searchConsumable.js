import React from "react";
import { ProductPicker } from "../../products/productPicker";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { SearchRow } from "./searchRow";
import { AddConsumable } from "../addConsumable";

const SearchCaller = GetAslModules('SearchCaller');
const TableView = GetAslModules('TableView');

export class SearchConsumable extends React.Component {
    productRef = React.createRef(null);
    searchRef = React.createRef(null);
    consumableRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onProductSelected = (product) => {
        const { id } = product;
        this.consumableRef.current?.setProduct(product);
        this.searchRef.current.setQuery({ query: { query: { id } } });
    }

    refreshSearch = () => {
        this.searchRef.current?.callZero();
    }

    render() {
        const { productPick = true, editNeeded = true, isPopUp = false } = this.props;
        const headings = ["Product id", "For", "Consumable product id", "Consumable", "Consumable Type", "Consums", "Actions"];
        const searchProps = {
            query: { query: {} },
            url: "/service/consumable/search",
            views: [
                {
                    view: TableView, iconStyle: "bi bi-table",
                    props: {
                        row: SearchRow,
                        rowParam: { others: { showEdit: (editNeeded && !isPopUp), isPopUp } },
                        style: "table table-striped table-hover m-0 table-sm align-middle", headings,
                        headingCss: "position-sticky top-0 z-3"
                    }
                }
            ],
            result: { from: 0, data: [] },
            onError: (er) => { console.log(er); },
        };
        let search = [];
        if (productPick) {
            search = [
                <div className="container card">
                    <ProductPicker ref={this.productRef} onSelected={this.onProductSelected} />
                </div>,
                <hr />,
                <AddConsumable ref={this.consumableRef} onSuccess={this.refreshSearch} />,
                <hr />
            ];
        }
        return (
            <div>
                {search}
                <SearchCaller ref={this.searchRef} {...searchProps} ></SearchCaller>
            </div>
        );
    }
}