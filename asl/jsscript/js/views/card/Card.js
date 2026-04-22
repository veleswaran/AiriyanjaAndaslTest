import React from "react";
import { AutoRender } from "../../utilities/rendering";

export class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { style = "", header, footer, body, data } = this.props;
        return (
            <div className="col">
                <div className={"card " + style}>
                    {header ? <div className="card-header">{AutoRender(header, data)}</div> : ""}
                    {body ? <div className="card-body">{AutoRender(body, data)}</div> : ""}
                    {footer ? <div className="card-footer">{AutoRender(footer, data)}</div> : ""}
                </div>
            </div>
        );
    }

}
