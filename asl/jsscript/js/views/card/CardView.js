import React from "react";
import { Card } from "./Card";

export class CardView extends React.Component {
    constructor(props) {
        super(props);
        const { serialFrom = 0, data = [] } = this.props;
        this.state = { serialFrom, data, isLoading: false };
    }

    setData = (dta) => {
        const { serialFrom = 0, data = [] } = dta;
        this.setState({ serialFrom, data, isLoading: false });
    }

    setLoading = (enabled) => {
        this.setState({ isLoading: enabled });
    }

    render() {
        const { needSerial = true, style, card = Card, cardParam = {} } = this.props;
        const { data, isLoading, serialFrom } = this.state;
        const rows = [];
        if (isLoading) {
            rows.push(<div className="col">Loading...</div>)
        } else {
            if (data.length > 0) {
                const { style, header, footer, body } = cardParam;
                let serial = serialFrom;
                data.forEach(datum => {
                    serial++;
                    rows.push(<div className="col">
                        {React.createElement(card, { serial, needSerial, data: datum, style, header, footer, body })}
                    </div>);
                });
            } else {
                rows.push(<div className="col">No Data!!!</div>)
            }
        }
        return (
            <div className={"row " + (style ? style : "row-cols-1 row-cols-md-2 row-cols-lg-3 g-1 p-1")}>
                {rows}
            </div>
        );
    }

}
