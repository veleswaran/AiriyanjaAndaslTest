import React from "react";
import { Button } from "react-bootstrap";


export class SearchBeamGroupRow extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { serial, data = {}, preProcessData: { keys = [] } = {}, others = {} } = this.props;
        const { needSelect = false, onSelect, onClose } = others;
        const { name: bgName = "", specDetails = [] } = data;
        const preRows = [];
        const specMap = new Map();
        for (const spec of specDetails) {
            const { specGroup: { name: sName } = {}, name = "" } = spec;
            specMap.set(sName, name);
        }
        for (const key of keys) {
            preRows.push(<td>{specMap.has(key) ? specMap.get(key) : ""}</td>);
        }
        let action = "";
        if (needSelect) {
            action = <Button variant="primary" onClick={() => {
                if (onSelect) {
                    onSelect(data)
                }
                if (onClose) {
                    onClose();
                }
            }}>select</Button>
        }
        return (
            <tr>
                <td>{serial}</td>
                <td className="fw-bold">{bgName}</td>
                {preRows}
                <td>{action}</td>
            </tr>
        );
    }
}