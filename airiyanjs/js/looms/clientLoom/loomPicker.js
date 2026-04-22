import React from "react";
import { importASL } from "../../utilities/utilities";
import { SearchClientLoom } from "./search/searchClientLoom";


export class LoomPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: null, enabled: true };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getValue = () => {
        const { data } = this.state;
        return data;
    }

    onSelect = (data) => {
        const { onSelect } = this.props;
        this.setState({ data })
        onSelect?.(data);
    }

    showClientPopup = () => {
        const { query = {} } = this.props;
        this.POPUP.current.showPopUp("Select client Loom", SearchClientLoom, 'bg-warning',
            {
                modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" },
                props: { onSelect: this.onSelect, query }
            });
    }

    render() {
        const { data } = this.state;
        const { title = "Select Loom" } = this.props;
        let nm = "";
        const labels = [];
        if (data) {
            const { client: { name = "" } = {}, number, consumption: { title } = {} } = data;
            labels.push(<span className="input-group-text">Client :{name}</span>);
            labels.push(<span className="input-group-text no-left-border">Loom No :{number}</span>);
            if (title) {
                labels.push(<span className="input-group-text no-left-border">Style :{title}</span>)
            }
        }
        return (
            <div className="input-group">
                {labels}
                <button className="btn btn-primary" onClick={this.showClientPopup}>{title}</button>
            </div>
        );
    }
}