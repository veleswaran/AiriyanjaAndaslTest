import React from "react";
import { Button } from "react-bootstrap";
import { GetAslModules } from "../utilities/utilities";

const TitledText = GetAslModules("TitledTextBox");

export class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        const { radios } = props;
        var key = "";
        if (radios) {
            key = radios[0];
        }
        this.state = { data: "", key };
    }

    onRadioChange = (evt) => {
        const value = evt.target.value;
        if (evt.target.checked) {
            this.setState({ key: value });
        }
    }

    onTextChange = (value) => {
        this.setState({ data: value });
    }

    onClick = (evt) => {
        const { data, key } = this.state;
        const { onClick } = this.props;
        if (onClick) {
            onClick({ data, key });
        }
    }

    render() {
        const { radios, searchTitle } = this.props;
        var radioValues = radios;
        if (!radioValues) {
            radioValues = [];
        }
        const allRadios = [];
        const radioName = Date.now();
        var loop = 0;
        radioValues.forEach(value => {
            const id = radioName + "-" + loop++;
            allRadios.push(<input type="radio" className="btn-check" name={radioName} id={id} value={value} autoComplete="off" onChange={this.onRadioChange}></input>);
            allRadios.push(<label className="btn btn-outline-primary align-content-center" for={id}>{value.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</label>)
        });
        const radioGroup = <div className="btn-group" role="group">{allRadios}</div>;
        return (
            <div className="input-group w-100 mx-auto p-0" >
                <div className="input-group-text">{searchTitle}</div>
                {radioGroup}
                <TitledText onChange={this.onTextChange} placeholder="value"></TitledText>
                <Button variant="primary" onClick={this.onClick}>Search</Button>
            </div>
        );
    }
}