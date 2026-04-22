import React, { Component } from 'react';


export class ToggleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOn: false
        };
    }

    handleToggle = () => {
        this.setState(prevState => ({
            isOn: !prevState.isOn
        }));
    };

    getValue = () => {
        return this.state.isOn;
    }

    render() {
        const { isOn } = this.state;
        const buttonClass = isOn ? 'btn btn-success' : 'btn btn-secondary';

        return (
            <button className={buttonClass} onClick={this.handleToggle}>
                {isOn ? 'ON' : 'OFF'}
            </button>
        );
    }
}