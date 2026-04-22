import React from "react";
import { AutoRender } from "../utilities/rendering";


export class QuickAdder extends React.Component {
    inputRef = React.createRef(null);
    suggestionRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = { isEditing: false, isDisabled: false };
    }

    onKeyDown = (e) => {
        switch (e.key) {
            case "Enter":
                this.callAdding();
                e.preventDefault();
                break;
            case "Escape":
                e.preventDefault();
                this.disableEditing();
                break;
        }
    }

    callAdding = () => {
        const { onAdd } = this.props;
        let value = this.inputRef.current?.value || "";
        value = value.trim();
        if (value.length > 0 && onAdd) {
            this.setState({ isDisabled: true }, () => { onAdd(value) });
        }
    }

    enableEditing = () => {
        this.setState({ isEditing: true, isDisabled: false });
    }

    disableEditing = () => {
        this.setState({ isEditing: false });
    }

    onChange = (e) => {
        const { onChange } = this.props;
        onChange?.(e.target.value);
        this.suggestionRef.current?.setLoading(true);
    }

    onItemSelected = (data) => {
        const { onSelect } = this.props;
        onSelect?.(data);
        this.disableEditing();
    }

    setValue = (value) => {
        if (this.inputRef.current) {
            this.inputRef.current.value = value;
        }
    }

    getValue = () => {
        if (this.state.isEditing) {
            return this.inputRef.current?.value || "";
        }
        return AutoRender(this.props.func?.currentLabel) || "";
    }

    setSuggestions = (suggestions = []) => {
        const { isEditing } = this.state;
        if (isEditing) {
            this.suggestionRef.current?.setSuggestions(suggestions);
        }
    }

    onBlur = () => {
        setTimeout(() => {
            this.disableEditing();
        }, 200);
    }

    render() {
        const { isEditing, isDisabled } = this.state;
        const { func: { currentLabel = "", suggestionLabel = "" }, placeholder = "Enter name" } = this.props;
        if (!isEditing) {
            return <div onClick={this.enableEditing}>{AutoRender(currentLabel)}</div>
        }
        return <>
            <input ref={this.inputRef} className="form-control form-control-sm" placeholder={placeholder} defaultValue={AutoRender(currentLabel)} disabled={isDisabled} onKeyDown={this.onKeyDown} onChange={this.onChange} onBlur={this.onBlur} autoFocus />
            <SuggestionList ref={this.suggestionRef} onSelect={this.onItemSelected} labelRenderer={suggestionLabel} />
        </>
    }
}


export class SuggestionList extends React.Component {
    constructor(props) {
        super(props)
        const { } = this.props;
        this.state = { visible: true, isLoading: false, suggestions: [] };
    }

    setVisible = (visible) => {
        this.setState({ visible, isLoading: false, suggestions: [] });
    }

    itemSelected = (data) => {
        const { onSelect } = this.props;
        this.setState({ visible: false });
        onSelect?.(data);
    }

    setLoading = (isLoading) => {
        this.setState({ isLoading });
    }

    setSuggestions = (suggestions = []) => {
        this.setState({ suggestions, isLoading: false, visible: true });
    }

    render() {
        const { labelRenderer } = this.props;
        const { isLoading, visible, suggestions } = this.state;
        let ren = [];
        if (isLoading) {
            ren.push(<div class="spinner-border spinner-border-sm mt-2" role="status"></div>);
        } else {
            for (const data of suggestions) {
                ren.push(<li><button className="list-group-item list-group-item-action" style={{ cursor: "pointer" }} onClick={() => { this.itemSelected(data); }}>{AutoRender(labelRenderer, data)}</button></li>);
            }
        }
        return <ul className={"list-group position-absolute w-100 bg-white card border-0 rounded-top-0 small list-unstyled" + (visible ? "" : "visually-hidden")} style={{ top: "100%", zIndex: 1000 }}>{ren}</ul>;
    }
}