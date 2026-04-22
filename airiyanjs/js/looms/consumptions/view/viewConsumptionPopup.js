import React, { Component } from "react";
import { importASL } from "../../../utilities/utilities";
import { getWeftName } from "../../utilities/utilities";

export default class ViewConsumptionPopup extends Component {
    async componentDidMount() {
        const { TOAST } = await importASL();
        this.TOAST = TOAST;
    }

    render() {
        const { data = {} } = this.props;

        return (
            <>
                <table className="table table-sm table-bordered table-info m-0 mt-1 mb-2">
                    <thead><tr><th>Name</th><th>Wage type</th><th>Cost</th><th>Reed</th><th>Pick</th><th>Sampled/Piece Length</th><th>Width</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{data.title}</td>
                            <td>{data.costType} Rate</td>
                            <td>₹ {data.cost}</td>
                            <td>{data.reed}</td>
                            <td>{data.pick}</td>
                            <td>{data.sampledLength} Metre</td>
                            <td>{data.width} inch</td>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-sm m-0 table-striped table-bordered mb-2">
                    <thead>
                        <tr><th colSpan={5}>Required Beam</th></tr>
                    </thead>
                    <tbody className="table-group-divider">
                        <tr>
                            <th>#</th>
                            <th>Group</th>
                            <th>Ends</th>
                            <th>Width</th>
                        </tr>
                        {data.beams?.map((row, i) => (
                            <tr key={row.id}>
                                <td>{i + 1}</td>
                                <td>{row.beamGroup.name}</td>
                                <td>{row.requiredThread}</td>
                                <td>{row.requredWidth} metre</td>
                            </tr>
                        ))}
                    </tbody>
                    <thead>
                        <tr><th colSpan={5}>Required Weft</th></tr>
                    </thead>
                    <tbody className="table-group-divider">
                        <tr>
                            <th>#</th>
                            <th colSpan={2}>Specification</th>
                            <th colSpan={2}>Consumes</th>
                        </tr>
                        {data.wefts?.map((row, i) => (
                            <tr key={row.id}>
                                <td>{i + 1}</td>
                                <td colSpan={2}>{getWeftName(row.weft)}</td>
                                <td colSpan={2}>{row.consumes} kg</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    }
}