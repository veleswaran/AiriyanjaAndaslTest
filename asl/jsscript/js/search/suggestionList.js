import React from "react";
import { getFilterKeyMatches } from "./utilities";

export class SuggestionList extends React.Component {
    constructor(props) {
        super(props)
        const { } = this.props;
        this.state = { visible: true, isLoading: false, suggestions: [] };
    }

    showKeySuggestion = (text = "", addedChips = []) => {
        const { filters = {}, filterKeys } = this.props;
        const suggestions = [];
        for (const key of getFilterKeyMatches(text, filters, filterKeys, addedChips)) {
            suggestions.push({ name: key, data: key });
        }
        this.setState({ visible: true, isLoading: false, suggestions });
    }

    setVisible = (visible) => {
        this.setState({ visible, isLoading: false, suggestions: [] });
    }

    itemSelected = (data) => {
        const { onSelect } = this.props;
        this.setState({ visible: false });
        onSelect?.(data);
    }

    render() {
        const { isLoading, visible, suggestions } = this.state;
        let ren = [];
        if (isLoading) {
            ren.push(<div class="spinner-border spinner-border-sm mt-2" role="status"></div>);
        } else {
            for (const sugges of suggestions) {
                const { name, data } = sugges;
                ren.push(<li><button className="list-group-item list-group-item-action" style={{ cursor: "pointer" }} onClick={() => { this.itemSelected(data); }}>{name}</button></li>);
            }
        }
        return <ul className={"list-group position-absolute w-100 bg-white card border-0 rounded-top-0 small list-unstyled" + (visible ? "" : "visually-hidden")} style={{ top: "100%", zIndex: 1000 }}>{ren}</ul>;
    }
}