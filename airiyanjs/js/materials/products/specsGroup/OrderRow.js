import React from "react";


export class OrderRow extends React.Component {
    constructor(props) {
        super(props)
    }

    getValue = () => {
        const { data } = this.props;
        return data;
    }

    render() {
        const { data, onClose } = this.props;
        const { name } = data;
        return (
            <tr>
                <td>{name}</td>
                <td><button className="btn btn-secondary" onClick={onClose}>X</button></td>
            </tr>
        );
    }
}