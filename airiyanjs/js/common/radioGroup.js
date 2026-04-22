import React from "react";


export class RadioGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = { valid: true }
    }

    onRadioChange = (evt) => {
        const value = evt.target.value;
        if (evt.target.checked) {
            this.setState({ selected: value });
        }
    }

    isValid = () => {
        const { selected } = this.state;
        const valid = selected ? true : false;
        this.setState({ valid });
        return valid;
    }

    getValue = () => {
        const { selected } = this.state;
        return { selected };
    }

    render() {
        const { valid } = this.state;
        const { radios = [], title = "", errorMessage = "Please select one option" } = this.props;
        const allRadios = [];
        const radioName = Date.now();
        let loop = 0;
        radios.forEach(value => {
            const id = radioName + "-" + loop++;
            allRadios.push(<input type="radio" className="btn-check" name={radioName} id={id} value={value} autoComplete="off" onChange={this.onRadioChange}></input>);
            allRadios.push(<label className="btn btn-outline-primary align-content-center" for={id}>{value.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</label>)
        });
        return <div className="input-group w-100 mx-auto p-0" >
            <div className="input-group-text">{title}</div>
            <div className="btn-group" role="group">{allRadios}</div>
            {
                !valid ? <div class="invalid-feedback d-block">{errorMessage}</div> : ""
            }
        </div>;
    }
}