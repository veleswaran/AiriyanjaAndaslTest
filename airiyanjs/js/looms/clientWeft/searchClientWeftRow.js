import React from "react";


export class SearchClientWeftRow extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { serial, data = {}, others = {} } = this.props;
        const { needSelect, onSelect, onClose } = others;
        const { stock, client = {}, weft = {} } = data;
        const { name } = client;
        const { specDetails = [] } = weft;
        const cls = [];
        for (const spd of specDetails) {
            const { name, specGroup: { name: sgName } = {} } = spd;
            cls.push(<span><strong> {sgName} : </strong>{name}</span>);
        }
        const action = [];
        if (needSelect) {
            action.push(
                <button className="btn btn-sm btn-secondary" onClick={() => {
                    onSelect?.(data);
                    onClose?.();
                }}>Select</button>
            )
        }
        return <tr>
            <td>{serial}</td>
            <td>{name}</td>
            <td>{cls}</td>
            <td>{stock + " kg"}</td>
            <td>{action}</td>
        </tr>
    }
}