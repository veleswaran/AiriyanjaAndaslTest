import React from "react";
import { GetAslModules, importASL } from "../../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../../globals/constants";
import { wildcardProcessor } from "../../../../utilities/searchUtilitiies";
const QuickAdder = GetAslModules("QuickAdder");
export class QuickSpecsAdd extends React.Component {
    quickAdderRef = React.createRef(null);
    constructor(props) {
        super(props);
        this.state = { data: props.data || {}, suggestions: [], groupId: props.data.specsGroupId }
    }

    async componentDidMount() {
        const { POPUP, TOAST } = await importASL();
        this.POPUP = POPUP;
        this.TOAST = TOAST;
    }

    onSuggestionSearch = (query) => {
        const { data: propsData = {}, onUpdate } = this.props;
        const { specGroup: { id } = {} } = propsData;
        if (onUpdate) { onUpdate(); }
        const specsName = []
        if (query) {
            specsName.push(wildcardProcessor(query))
        }
        const requestOption = { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ query: { specsName, groupId: [id] }, from: 0, limit: 10 }) };

        fetch("/service/specs_name/search", requestOption)
            .then((response) => { if (!response.ok) { throw new Error(response.status); } return response.json(); })
            .then((response) => {
                let { data = [] } = response;
                this.setState({ suggestions: data });
                this.quickAdderRef.current?.setSuggestions(data);
            })
            .catch((error) => { console.error(error); });
    };

    onAdd = (value) => {
        const { suggestions = [], groupId } = this.state
        const { data = {} } = this.props;
        const existing = suggestions.find(item => item.name?.toLowerCase() === value.toLowerCase() && item.specGroup.id === groupId);
        if (existing) { this.onSuggestionSelect(existing); this.quickAdderRef.current?.disableEditing(); return; }

        if (!window.confirm(`Are you sure you want to add "${value}"?`)) {
            this.quickAdderRef.current?.enableEditing()
            this.quickAdderRef.current?.setValue(value)
            return;
        }

        const requestOption = { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ name: value, id: data.specGroup?.id }) };

        fetch("/service/specs_name/add", requestOption)
            .then((response) => { if (!response.ok) { throw new Error(response.status); } return response.json(); })
            .then((respos) => {
                const { result, data: addedData } = respos;
                if (result === RESULT_SUCCESS && addedData && addedData.specsGroupId === groupId) {
                    this.setState({ data: { ...this.state.data, ...addedData }, suggestions: [] }, () => {
                        const { onUpdate } = this.props;
                        if (onUpdate) { onUpdate(); }
                        this.quickAdderRef.current?.disableEditing()
                    });
                } else {
                    this.TOAST.current.showFailed("Failed", respos.message || "Unable to add spec name");
                    this.quickAdderRef.current?.enableEditing()
                    this.quickAdderRef.current?.setValue(value)
                }
            })
            .catch((error) => {
                console.error(error);
                this.TOAST.current.showFailed("Error", respos.message || "Unable to add spec name");
                this.quickAdderRef.current?.enableEditing()
                this.quickAdderRef.current?.setValue(value)
            });
    }

    onSuggestionSelect = (suggestion) => {
        this.setState({ data: suggestion, suggestions: [] }, () => {
            const { onUpdate } = this.props;
            if (onUpdate) {
                onUpdate();
            }
        });
    }

    getValue = () => {
        const { data } = this.state;
        return data;
    }

    render() {
        const { onClose } = this.props;
        const { data = {} } = this.state;
        const { name = "", specGroup: { name: groupName = "" } = {} } = data;
        const value = data.value || data.name || "";
        return (
            <tr>
                <td>{groupName}</td>
                <td className="position-relative">
                    <QuickAdder ref={this.quickAdderRef}
                        placeholder={name}
                        func={{ currentLabel: value || name || "", suggestionLabel: (item) => item.name }}
                        onChange={this.onSuggestionSearch}
                        onSelect={this.onSuggestionSelect}
                        onAdd={this.onAdd}
                    />
                </td>
                <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger bi bi-x-lg" onClick={onClose}></button>
                </td>
            </tr>
        );
    }
}