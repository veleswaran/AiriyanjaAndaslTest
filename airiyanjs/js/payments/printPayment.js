import React from "react";
import { fromHex, fromJsonString } from "../utilities/objectUtils";
import { PaymentViewer } from "./paymentViewer";
import { getQueryParam } from "../utilities/utilities";

import("../css/print.css");

export class PrintPayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: null };
    }

    async componentDidMount() {
        const { data = "" } = getQueryParam();
        const json = fromHex(data);
        const obj = fromJsonString(json);
        this.setState({ data: obj });
    }

    render() {
        const { data } = this.state;
        if (data) {
            return <PaymentViewer data={data} />;
        }
        return "None";
    }
}