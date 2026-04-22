import React from "react";
import { CommoditySearch } from "./commoditySearch";
import { CommodityAdd } from "./commodityAdd";
import { Button } from "react-bootstrap";
import { importASL } from "../../utilities/utilities";
import { CommodityEdit } from "./edit/commodityEdit";

export class CommodityPage extends React.Component {
    commodityRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    refresh = () => {
        this.commodityRef?.current?.callZero();
    }

    showCommodityAdd = () => {
        this.POPUP.current.showPopUp("Add Commodity", CommodityAdd, "bg-warning", { modalProps: { size: 'md', className: "bg-opacity-75 bg-dark", css: { footer: "visually-hidden" } }, props: { refresh: this.refresh } });
    }
    render() {
        return (
            <div className="container">
                <div>
                    <button className="btn btn-primary bi bi-plus-lg" onClick={this.showCommodityAdd}></button>
                </div>
                <div className="mt-1">
                    <CommoditySearch ref={this.commodityRef} />
                </div>
            </div>
        );
    }
}