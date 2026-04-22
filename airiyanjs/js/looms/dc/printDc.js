import React from "react";
import { RESULT_SUCCESS } from "../../globals/constants";
import { getQueryParam, importASL } from "../../utilities/utilities";
import { ViewDc } from "./viewDc";

import("../../css/print.css");

export class PrintDc extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: null };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
        const { dcid = 0, type = "" } = getQueryParam();
        const url = "/service/dc/delivery/get";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: dcid })
        }
        ).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        }).then(this.processSuccess).catch(this.processError);
    }


    processError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to get Dc details, try again later");
    }

    processSuccess = (rData) => {
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            this.setState({ data });
        } else {
            this.TOAST.current?.showFailed("Unable get Dc details", message || "Unknown error");
        }
    }

    render() {
        const { data } = this.state;
        if (data) {
            return <ViewDc data={data} />;
        }
        return "None";
    }
}