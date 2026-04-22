import React from "react";


export class IsWriteOff extends React.Component {
    constructor(props) {
        super(props)
        this.state = { writeOff: false }
    }

    onChange = (e) => {
        const { onChange } = this.props;
        this.setState({ writeOff: e.target.checked }, () => {
            onChange?.(this.state.writeOff);
        });
    }

    isValid = () => {
        return true;
    }

    getValue = () => {
        const { writeOff } = this.state;
        return writeOff;
    }

    render() {
        const { writeOff } = this.state;
        return <div className="d-flex">
            <span className="fw-bold">Write Off :</span>
            <div className="flex-fill ms-2">{writeOff ? "Yes" : "No"}</div>
            <div className="form-check form-switch align-content-center">
                <input className="form-check-input" type="checkbox" onChange={this.onChange} defaultChecked={writeOff} />
            </div>
        </div>
    }
}
