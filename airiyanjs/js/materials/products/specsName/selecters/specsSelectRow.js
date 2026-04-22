import React from "react";

export class SpecsSelectRow extends React.Component {
    constructor(props) {
        super(props)
    }

    getValue = () => {
        const { data } = this.props;
        return data;
    }

    render() {
        const { data = {}, onClose } = this.props;
        const { name = "", specGroup: { name: groupName = "" } = {} } = data;
        return (
            <tr>
                <td>{groupName}</td>
                <td>{name}</td>
                <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger bi bi-x-lg" onClick={onClose}></button>
                </td>
            </tr>
        );
    }
}