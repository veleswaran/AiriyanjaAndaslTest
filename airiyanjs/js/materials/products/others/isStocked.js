import React from "react";

export class IsStocked extends React.Component {
    constructor(props) {
        super(props)
        this.state = { stocked: true }
    }

    onChange = (e) => {
        this.setState({ stocked: e.target.checked });
    }

    isValid = () => {
        return true;
    }

    getValue = () => {
        const { stocked } = this.state;
        return stocked;
    }

    setValue = (stocked) => {
        this.setState({ stocked });
    }

    render() {
        const { stocked } = this.state;
        return <tr>
            <td colspan="3">
                <div className="d-flex">
                    <span className="fw-bold">Stockable :</span>
                    <div className="flex-fill ms-2">{stocked ? "Yes" : "No"}</div>
                    <div className="form-check form-switch align-content-center">
                        <input className="form-check-input" type="checkbox" onChange={this.onChange} checked={stocked} />
                    </div>
                </div>
            </td>
        </tr>
    }
}
