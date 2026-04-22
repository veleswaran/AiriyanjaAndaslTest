import React from "react";
import { IdentifierSearch } from "./identifierSearch";
import { importASL } from "../../utilities/utilities";

export class IdentifierPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { identifier: {} };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    isValid() {
        const { identifier } = this.state;
        return Object.keys(identifier).length > 0;
    }

    identifierSelected = (data) => {
        const { onSelect } = this.props;
        if (onSelect) onSelect(data);
        this.setState({ identifier: data });
    }

    getValue() {
        const { identifier } = this.state;
        return identifier;
    }

    showIdentifier = () => {
        this.POPUP.current?.showPopUp( "Select Identifier", IdentifierSearch, "", { props: { onSelect: this.identifierSelected } }, );
    }

    render() {
        const { identifier: { name = "" } = {} } = this.state;
        const { css = "", style = {} } = this.props;
        return <div className={"input-group " + css} style={style}>
            <button className="btn btn-primary bi bi-pencil" onClick={this.showIdentifier} >+</button>
            <span className="input-group-text">Identifier name :-</span>
            <strong className="input-group-text bg-light">{name}</strong>
        </div>;
    }
}