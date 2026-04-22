import React from "react";


export class ViewConsumption extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return "";
    }
}


export class ViewConsumptionBeam extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { beams = [], css = "" } = this.props;
        const rows = [];
        for (const beam of beams) {
            const { beamGroup: { name } = {}, requiredNumber, requiredThread, requredWidth } = beam;
            rows.push(<tr><td>{name}</td><td>{requiredNumber}</td><td>{requiredThread}</td><td>{requredWidth}</td></tr>);
        }
        return <table className={"table " + css}>
            <thead>
                <tr>
                    <th>Group Name</th>
                    <th>Required Number</th>
                    <th>Required Thread</th>
                    <th>Required Width</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    }
}
