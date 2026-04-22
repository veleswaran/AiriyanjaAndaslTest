import React from "react";
import { getQueryParam } from "../../utilities/utilities";

import "../../css/print.css";
import "./printQR.css";

export class PrintQR extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { uid, group, length, threadCount, width } = getQueryParam();

        return (
            <table className="card m-0 mx-auto" style={{ maxWidth: "12cm", maxHeight: "4cm" }}>
                <tbody>
                    <tr>
                        <td>
                            <img src={"/service/image/qr/" + uid + ".png"} className="img-fluid rounded-start" alt="Card" />
                        </td>
                        <td>
                            <table className="table m-0" style={{ width: "8cm" }}>
                                <tbody>
                                    <tr>
                                        <td>Beam Id</td>
                                        <td><strong>{uid}</strong></td>
                                        <td>Group</td>
                                        <td><strong>{group}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Length</td>
                                        <td><strong>{length}</strong></td>
                                        <td>Width</td>
                                        <td><strong>{width}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Thread</td>
                                        <td><strong>{threadCount}</strong></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
