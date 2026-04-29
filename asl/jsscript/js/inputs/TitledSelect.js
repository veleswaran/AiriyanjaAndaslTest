import React from "react";
import { uuidv4 } from "../utilities/uuidv4";

export class TitledSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "", uuid: uuidv4(), validClass: "" };
    }

    changeValue = (evt) => {
        const value = evt.target.value;
        this.setState({ value }, () => {
            if (this.props.onChange) this.props.onChange(value, evt.target);
            this.isValid();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.options !== prevProps.options || this.state.value !== prevState.value) {
            const { options = [], isstringlist = true } = this.props;
            const { value } = this.state;
            if (value && value !== "") {
                const searchVal = String(value).toLowerCase().trim();
                const matchedOpt = options.find(opt => {
                    const optVal = isstringlist ? opt : opt?.value;
                    return String(optVal || "").toLowerCase().trim() === searchVal;
                });
                if (matchedOpt) {
                    const matchedVal = isstringlist ? matchedOpt : matchedOpt.value;
                    if (matchedVal !== value) this.setState({ value: matchedVal });
                }
            }
        }
    }

    getValue = () => {
        return this.state.value;
    }

    setValid = (valid) => {
        this.setState({ validClass: valid ? "is-valid" : "is-invalid" });
    }

    setValue = (value) => {
        this.setState({ value: value || "" }, () => this.isValid());
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
        return (<div className="form-floating" >
            <select key={uuid} className={validClass + " form-control " + (this.props.class || "")}
                name={name} placeholder={placeholder} onChange={this.changeValue} id={uuid} value={value || ""} >
                <option value="">-Select-</option>
                {options.map((opt, idx) => {
                    const val = isstringlist ? opt : opt.value;
                    const label = isstringlist ? opt : opt.label;
                    return <option key={idx} value={val}>{label}</option>;
                })}
            </select>
            <label htmlFor={uuid} > {placeholder}</label>
        </div>);
    }
}