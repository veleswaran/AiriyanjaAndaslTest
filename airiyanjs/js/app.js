
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import React from "react";
import { importASL } from "./utilities/utilities";

export class App extends React.Component {
    popupRef = React.createRef(null);
    toastRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        var { addPopUpController, addToastController } = await importASL();
        addToastController(this.toastRef.current,"position-fixed p-3 h-100 overflow-hidden");
        addPopUpController(this.popupRef.current);
    }

    render() {
        return <>
            <RouterProvider router={router} />
            <div ref={this.toastRef}></div>
            <div ref={this.popupRef}></div>
        </>;
    }

}