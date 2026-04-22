import React from "react";

export class SpinLoader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { spinClass = "spinner-border spinner-border-sm", additionsClass = "" } = this.props;
        return (
            <span class={spinClass + " " + additionsClass} role="status">
                <span class="visually-hidden"> Loading...</span>
            </span>
        );
    }
}