import React, { createRef } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { SpecsGroupNameAdd } from "./specsGroupNameAdd";
import { Button } from "react-bootstrap";
import { importASL } from "../../../utilities/utilities";
import { SearchSpecsGroup } from "./SearchSpecsGroup";
import { OrderOfDisplay } from "./OrderOfDisplay";

export class SpecsGroupNamePage extends React.Component {
    specsGroupNameRef = createRef();
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }
    refresh = () => {
        this.specsGroupNameRef?.current.callZero();
    }
    showSpecsGroupNameAdd = () => {
        this.POPUP.current.showPopUp("Add New Specs Group", SpecsGroupNameAdd, "bg-warning", { modalProps: { size: 'md', className: "bg-opacity-75 bg-dark", css: { footer: "visually-hidden" } }, props: { refresh: this.refresh } });
    }
    render() {
        return (
            <div className="container">
                <div className="p-0"> <button className="btn btn-primary bi bi-plus-lg" onClick={this.showSpecsGroupNameAdd}></button> </div>
                <div className="col mt-1 m-0 p-0">
                    <Tabs defaultActiveKey="search" className="border-1">
                        <Tab eventKey="search" title="Search">
                            <div className="px-1 py-1 border border-top-0">
                                <SearchSpecsGroup ref={this.specsGroupNameRef} />
                            </div>
                        </Tab>
                        <Tab eventKey="settings" title="Settings">
                            <div className="p-2 border border-top-0">
                                <OrderOfDisplay />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}