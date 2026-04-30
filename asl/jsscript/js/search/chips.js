import React from "react";
import { FILTERS, MAX_CHARACTER_LEN, SPECIAL_FILTER_TYPES, SPECIAL_KEYS } from "./constants";
import { POPUP } from "../app";
import { AutoRender } from "../utilities/rendering";

export class Chips extends React.Component {
    inputRef = React.createRef(null);
    containerRef = React.createRef(null);
    tooltipRef = React.createRef(null);
    constructor(props) {
        super(props)
        const { data = {}, filter = {} } = this.props;
        const isSpecialFilter = SPECIAL_FILTER_TYPES.includes(filter.type);
        const { type } = filter;
        let inputType = "";
        switch (type) {
            case FILTERS.DATE:
                inputType = "date";
                break;
        }
        this.state = { filterKey: data.key, filterValue: data.value, editing: false, isValid: true, isSpecialFilter, focused: false, inputType, tooltipPosition: "top" };

    }

    componentDidMount() {
        this.POPUP = POPUP;
        window.addEventListener('scroll', this.handleScroll, true);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll, true);
    }

    handleScroll = () => {
        if (this.state.focused && this.containerRef.current) {
            const rect = this.containerRef.current.getBoundingClientRect();
            let threshold = 50;
            if (this.tooltipRef.current) {
                threshold = this.tooltipRef.current.offsetHeight + 10;
            }
            const tooltipPosition = rect.top < threshold ? "bottom" : "top";
            if (tooltipPosition !== this.state.tooltipPosition) {
                this.setState({ tooltipPosition });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { filter, onFilterUpdate } = this.props;
        const { filterKey, filterValue } = this.state;
        if (prevState.filterValue !== filterValue) {
            onFilterUpdate?.({ key: filterKey, value: filterValue, filter });
        }
    }

    getValue = () => {
        const { filter } = this.props;
        const { filterKey, filterValue } = this.state;
        return { key: filterKey, value: filterValue, filter };
    }


    inputSize = (length) => {
        const { filter: { type } } = this.props;
        let width = length;
        if (width < 16 && type === FILTERS.DATE) {
            width = 16;
        }
        width = width + 2;
        return `${width}ch`;
    }

    enableEditing = (focusInput = false) => {
        const { editing, filterValue } = this.state;
        if (!editing) {
            this.setState({ editing: true });
            // this.inputRef.current.disabled = false;
            if (focusInput) {
                this.inputRef.current?.focus();
            }
            this.inputRef.current.value = filterValue;
            this.inputRef.current.style.width = this.inputSize(filterValue.length);
        }
    }

    disableEditing = (saveValue = true) => {
        const { editing, isValid } = this.state;
        if (editing) {
            if (saveValue) {
                if (isValid) {
                    const newstate = { editing: false };
                    newstate.filterValue = this.inputRef.current.value
                    // this.inputRef.current.disabled = true;
                    this.setState(newstate);
                }
            } else {
                const newstate = { editing: false, isValid: true };
                // this.inputRef.current.disabled = true;
                this.setState(newstate);
            }
        }
    }

    setValue = (newValue) => {
        this.setState({ filterValue: newValue });
    }

    showPopUpIfNecessary = (filter) => {
        const { type, poper } = filter;
        if (type === FILTERS.POPER) {
            const { select: { component, title = "Select value", props: poperProps, modalProps } } = poper || {};
            this.POPUP.current?.showPopUp(title, component, "", { modalProps, props: { ...poperProps, onSelect: this.setValue } });
        }
    }

    onClose = (e) => {
        const { onClose, id } = this.props;
        onClose?.(id);
    }

    onBlur = (e) => {
        this.setState({ focused: false }, this.disableEditing);
    }

    onFocus = (e) => {
        const { filter: { type } } = this.props;
        let tooltipPosition = "top";
        if (this.containerRef.current) {
            const rect = this.containerRef.current.getBoundingClientRect();
            let threshold = 50;
            if (this.tooltipRef.current) {
                threshold = this.tooltipRef.current.offsetHeight + 10;
            }
            if (rect.top < threshold) {
                tooltipPosition = "bottom";
            }
        }
        switch (type) {
            case FILTERS.POPER:
                this.setState({ focused: true, tooltipPosition });
                break;
            default:
                this.setState({ focused: true, tooltipPosition }, () => {
                    this.enableEditing(false);
                });
                break;
        }
    }

    onClick = (e) => {
        const { filter = {} } = this.props;
        const { type } = filter;
        switch (type) {
            case FILTERS.POPER:
                this.showPopUpIfNecessary(filter);
                break;
            default:
                this.enableEditing(true);
                break;
        }
    }

    onInput = (e) => {
        e.target.style.width = this.inputSize(e.target.value.length);
    }

    onKeyDown = (e) => {
        const { filter = {} } = this.props;
        const { keyPreventer, type, poper = {} } = filter;
        switch (type) {
            case FILTERS.POPER:
                let preventDefault = false;
                const { view: { component, title, modalProps, props } } = poper;
                const { filterValue } = this.state;
                switch (true) {
                    case ["v"].includes(e.key):
                        if (component) {
                            this.POPUP.current?.showPopUp(title, component, "", { modalProps, props: { ...props, data: filterValue } });
                        }
                        preventDefault = true;
                        break;
                    case SPECIAL_KEYS.includes(e.key):
                        preventDefault = false;
                        break;
                    default:
                        this.showPopUpIfNecessary(filter);
                        preventDefault = true;
                        break;
                }
                if (preventDefault) {
                    e.preventDefault();
                }
                break;
            default:
                const cval = e.target.value;
                if (cval.length < MAX_CHARACTER_LEN) {
                    let executeKeyPrev = false;
                    switch (e.key) {
                        case "Enter":
                            this.disableEditing();
                            e.preventDefault();
                            return;
                        case "Escape":
                            this.disableEditing(false);
                            e.preventDefault();
                            return;
                        default:
                            executeKeyPrev = true;
                            break;
                    }
                    if (executeKeyPrev && keyPreventer?.(e.key, cval)) {
                        e.preventDefault();
                    }
                } else {
                    e.preventDefault();
                }
                break;
        }
    }

    onChange = (evt) => {
        const { filter = {} } = this.props;
        const { validator } = filter;
        const cval = evt.target.value;
        let res = cval.length <= MAX_CHARACTER_LEN;
        if (validator) {
            res = validator(cval) ? res : false;
        }
        this.setState({ isValid: res });
    }


    onPaste = (e) => {
        const { filter = {} } = this.props;
        const { pastePreventer, validator, type } = filter;
        if (type === FILTERS.POPER) {
            e.preventDefault();
            return
        }
        const pastedText = (e.clipboardData || window.clipboardData).getData('text').trim();
        const cval = e.target.value;
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const simulated = cval.slice(0, start) + pastedText + cval.slice(end);
        let needValidation = true;
        if (pastePreventer?.(pastedText, cval, simulated)) {
            e.preventDefault();
            needValidation = false;
        }
        if (needValidation && validator) {
            if (!validator(simulated)) {
                e.preventDefault();
            }
        }
    }

    render() {
        const { css: { chip = "d-flex align-items-center rounded-1 border small", normal = "bg-body-secondary", highlight = "bg-primary text-white border-primary-subtle" } = {}, style = { cursor: "pointer" }, filter = {}, tooltip = "Press 'V' to View, Others to Edit" } = this.props;
        const { filterKey, filterValue, editing, isValid, isSpecialFilter, focused, inputType, tooltipPosition } = this.state;
        const validClass = isValid ? "" : "text-danger";
        const { poper: { display: { component } = {} } = {}, type } = filter;
        let displayValue = filterValue;
        switch (type) {
            case FILTERS.POPER:
                displayValue = AutoRender(component, filterValue);
                break;
        }
        return <div ref={this.containerRef} className={`${chip} ` + ((editing || focused) ? highlight : normal)} style={style} title={tooltip} >
            <div className="d-flex align-items-center ps-1">
                <p className="m-0 d-flex align-items-center" onClick={this.onClick}>
                    <strong className={isSpecialFilter ? "d-none" : ""}>{filterKey}<span className="mx-1">:</span></strong>
                    <p className={"d-inline-block m-0 " + (editing ? "visually-hidden" : "")} style={{ maxWidth: "300px" }}>{displayValue}</p>
                    <input ref={this.inputRef} className={`border bg-white ${validClass} ` + (editing ? "" : "visually-hidden")} onBlur={this.onBlur} onFocus={this.onFocus} onInput={this.onInput}
                        type={inputType} maxLength={MAX_CHARACTER_LEN} onKeyDown={this.onKeyDown} onChange={this.onChange} onPaste={this.onPaste} />
                </p>
                <button className="btn btn-sm btn-close" onClick={this.onClose}></button>
            </div>
            {focused && tooltip && (
                <div className="position-relative w-100">
                    <div ref={this.tooltipRef} className="position-absolute bg-dark text-white px-2 py-1 rounded small shadow" style={{ ...(tooltipPosition === "top" ? { bottom: "15px" } : { top: "15px" }), zIndex: 1050, minWidth: "210px", transform: "translateX(-50%)" }}>
                        {typeof tooltip === 'string' && tooltip.includes("'V'") ?
                            tooltip.split("'V'").map((part, index, arr) =>
                                index === arr.length - 1 ? part : <React.Fragment key={index}>{part}<span className="bg-white text-dark px-1 rounded fw-bold mx-1">V</span></React.Fragment>
                            ) : tooltip}
                    </div>
                </div>
            )}
        </div>;
    }
}
