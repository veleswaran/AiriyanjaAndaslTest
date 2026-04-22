import React from "react";
import { uuidv4 } from "../../utilities/uuidv4";

export class TableRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { needSerial, serial, data = {}, cells = [], styleFunc } = this.props;
        const allChild = [];
        if (needSerial) {
            allChild.push(<th scope="row">{serial}</th>);
        }
        cells.forEach(keyseq => {
            const { key = "", styleFunc, processor, renderer, defaultValue = "", inlineStyle = {} } = keyseq || {};
            var keyVal = "";
            if (processor) {
                keyVal = processor(data);
            } else {
                keyVal = key.split('.').reduce((acc, ky) => acc && acc[ky], data) || defaultValue;
            }
            const cellClass = styleFunc ? styleFunc(data) : "";
            allChild.push(<td style={inlineStyle} className={cellClass}>{renderer ? renderer(keyVal, data) : keyVal}</td>);
        });
        var rowstyle = "";
        if (styleFunc) {
            rowstyle = styleFunc(data);
        }
        return (<tr key={uuidv4()} className={rowstyle}>{allChild}</tr>);
    }
}