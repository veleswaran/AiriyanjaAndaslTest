import React from "react";
import { uuidv4 } from "../utilities/uuidv4";

export class TitledSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "", uuid: uuidv4(), validClass: "" };
    }

    changeValue = (evt) => {
        this.state.value = evt.target.value;
        if (this.props.onChange) {
            this.props.onChange(evt.target.value, evt.target);
        }
        this.isValid();
    }

    setValue = (value) => {
        this.setState({ value: value }, () => this.isValid());
    }

    getValue = () => {
        return this.state.value;
    }

    setValid = (valid) => {
        this.setState({ validClass: valid ? "is-valid" : "is-invalid" });
    }

    isValid = () => {
        const { validator } = this.props;
        const { value } = this.state;
        var res = true;
        if (!value || !value.trim() === "" || this.state.value.trim() === "select") {
            res = false;
        }
        if (validator) {
            res = validator(value) ? res : false;
        }
        this.setState({ validClass: res ? "is-valid" : "is-invalid" });
        return res;
    }

    render() {
        const { uuid, validClass, value } = this.state;
        const { placeholder = "", name, isstringlist = true, options = [] } = this.props;
        const allOptions = [];
        allOptions.push(<option value="" selected="" >-Select-</option>);

        let displayValue = value || "";
        if (displayValue !== "") {
            const searchVal = String(displayValue).toLowerCase().trim();
            const matchedOpt = options.find(opt => {
                const optVal = isstringlist ? opt : opt?.value;
                return String(optVal || "").toLowerCase().trim() === searchVal;
            });
            if (matchedOpt) {
                displayValue = isstringlist ? matchedOpt : matchedOpt.value;
            }
        }

        if (isstringlist) {
            options.forEach(option => {
                allOptions.push(<option value={option}>{option}</option>);
            });
        } else {
            options.forEach(option => {
                allOptions.push(<option value={option.value}>{option.label}</option>);
            });
        }
        return (<div class="form-floating" >
            <select key={uuid} class={validClass + " form-control " + (this.props.class || "")} name={name} placeholder={placeholder} onChange={this.changeValue} id={uuid} value={displayValue}>
                {allOptions}
            </select>
            <label for={uuid} > {placeholder}</label>
        </div>
        );
    }
}