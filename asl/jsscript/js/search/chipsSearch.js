import React from "react";
import { MultiRender, POPUP } from "../app";
import { Chips } from "./chips";
import { validateDecimal, validateInt, validatePDecimal, validatePInt } from "../utilities/validationUtil";
import { FILTERS, MAX_CHARACTER_LEN, SPECIAL_FILTER_TYPES, SPECIAL_KEYS } from "./constants";

import './styles/chipStyle.css'
import { SuggestionList } from "./suggestionList";
import { getFilterKeyMatches, isKeyAllowed } from "./utilities";

/* Sample Filter items
filter:{
     ends: { type: "pint", filterKey: "threadCount", count: 10, keyPreventer:(key,currentval)=>{}, validator:(value)=>{}, valueProcessor:(value)=>{}, 
                pastePreventer:(pastedText, currentVal, simulatedVal)=>{} },
     nonkey1: { type: "nonkey" },
     client: { type: "poper", poper:{select: { component, title, props, modalProps }, view: { component, title, modalProps },display: { component }},valueProcessor}
}
*/

export class ChipsSearch extends React.Component {
    parentRef = React.createRef(null);
    inputRef = React.createRef(null);
    chipsRef = React.createRef(null);
    suggestionRef = React.createRef(null);
    constructor(props) {
        super(props)
        const { filters = {} } = this.props;
        const filterKeys = Object.keys(filters).filter(key => !SPECIAL_FILTER_TYPES.includes(filters[key].type));
        const specialFilterKeys = Object.keys(filters).filter(key => SPECIAL_FILTER_TYPES.includes(filters[key].type));
        this.state = { currentFilter: null, shadowText: "", filterKeys, specialFilterKeys, isTextValid: true, inputType: "" };
        for (const key in filters) {
            switch (filters[key].type) {
                case FILTERS.INT:
                    filters[key].validator = validateInt;
                    break;
                case FILTERS.PINT:
                    filters[key].validator = validatePInt;
                    break;
                case FILTERS.DECIMAL:
                    filters[key].validator = validateDecimal;
                    break;
                case FILTERS.PDECIMAL:
                    filters[key].validator = validatePDecimal;
                    break;
            }
        }
    }

    componentDidMount() {
        this.POPUP = POPUP;
        this.inputRef.current?.focus();
    }

    onUpdate = () => {
        const { onUpdate } = this.props;
        onUpdate?.();
    }

    addChip = (key, value, filter) => {
        const addedChips = this.chipsRef.current.getValue();
        const totalAdded = addedChips.filter(item => item.key === key).length
        const { count = 1 } = filter;
        if (totalAdded < count) {
            this.chipsRef.current?.add({ props: { data: { key, value }, filter, onFilterUpdate: this.onUpdate, tooltip: filter.tooltip } });
            this.inputRef.current.value = "";
            this.setState({ currentFilter: null, shadowText: "", isTextValid: true, inputType: "" });
            return true;
        }
        return false;
    }

    addSpecialChip = (value) => {
        const { specialFilterKeys } = this.state;
        const { filters } = this.props;
        let res = false;
        if (value.trim() !== "" && value.length <= MAX_CHARACTER_LEN && specialFilterKeys.length > 0) {
            const specialKey = specialFilterKeys[0];
            const filter = filters[specialKey];
            res = this.addChip(specialKey, value.trim(), filter);
        }
        return res;
    }

    onValueSelect = (cfilter, selected) => {
        const { currentFilter } = this.state;
        const { key, filter } = currentFilter;
        this.addChip(key, selected, filter);
    }

    setFilter = (key, value = "", { noPoper = false } = {}) => {
        const { filters } = this.props
        const { currentFilter } = this.state;
        if (currentFilter === null) {
            const addedChips = this.chipsRef.current.getValue();
            const canAdd = isKeyAllowed(key, filters, addedChips);
            if (canAdd) {
                const filter = filters[key];
                const { type } = filter;
                let inputType = "";
                switch (type) {
                    case FILTERS.DATE:
                        inputType = "date";
                        break;
                }
                setInputValue(this.inputRef, value);
                this.suggestionRef.current.setVisible(false);
                this.setState({ currentFilter: { key, filter }, shadowText: "", inputType }, () => {
                    if (!noPoper) {
                        this.showPopUpIfNecessary(filter);
                    }
                });
            }
            this.setState({ isTextValid: canAdd });
            return canAdd;
        }
        return false;
    }

    getValue = () => {
        const res = {};
        const addedChips = this.chipsRef.current.getValue();
        for (const chip of addedChips) {
            const { key = "", value = "", filter } = chip;
            const { filterKey = key, count = 1, valueProcessor } = filter;
            const newValue = valueProcessor ? valueProcessor(value) : value;
            if (count === 1) {
                res[filterKey] = newValue;
            } else {
                if (!res[filterKey]) {
                    res[filterKey] = [];
                }
                res[filterKey].push(newValue);
            }
        }
        return res;
    }

    getShadowText = (val) => {
        const { filters = {} } = this.props;
        const { filterKeys } = this.state;
        const addedChips = this.chipsRef.current.getValue();
        let res = "";
        const filterMatches = getFilterKeyMatches(val, filters, filterKeys, addedChips);
        if (filterMatches.length > 0) {
            res = filterMatches[0];
        }
        return res || "";
    }

    onChange = (e) => {
        const { currentFilter } = this.state;
        const cval = e.target.value;
        if (currentFilter === null) {
            let shadowText = "";
            if (cval) {
                const addedChips = this.chipsRef.current.getValue();
                this.suggestionRef.current.showKeySuggestion(cval, addedChips);
                shadowText = this.getShadowText(cval);
            } else {
                this.suggestionRef.current.setVisible(false);
            }
            this.setState({ shadowText, isTextValid: true });
        } else {
            const { filter = {} } = currentFilter;
            const { validator } = filter;
            if (validator) {
                this.setState({ isTextValid: validator(cval) });
            } else {
                this.setState({ isTextValid: true });
            }
        }
    }

    showPopUpIfNecessary = (filter) => {
        const { type, poper } = filter;
        if (type === FILTERS.POPER) {
            const { select: { component, title = "Select value", props: poperProps, modalProps } } = poper || {};
            const selectFunction = (selected) => {
                this.onValueSelect(filter, selected);
            }
            this.POPUP.current?.showPopUp(title, component, "", { modalProps, props: { ...poperProps, onSelect: selectFunction } });
        }
    }

    onSuggestionClicked = (data) => {
        const { currentFilter } = this.state;
        if (currentFilter === null) {
            if (this.setFilter(data)) {
                this.inputRef.current?.focus();
            }
        }
    }

    onKeyDown = (e) => {
        const { currentFilter, shadowText } = this.state;
        const cval = e.target.value;
        if (currentFilter === null) {
            switch (e.key) {
                case "Enter":
                case ":":
                    this.setFilter(cval);
                    e.preventDefault();
                    break;
                case "Tab":
                    if (shadowText && shadowText !== "") {
                        e.preventDefault();
                        e.target.value = shadowText;
                        this.setState({ isTextValid: true });
                    }
                    break;
                case " ":
                    if (this.addSpecialChip(cval)) {
                        e.preventDefault();
                        e.target.value = "";
                        this.setState({ shadowText: "", isTextValid: true });
                    }
                    break;
                case "Backspace":
                    if (cval.length === 0) {
                        e.preventDefault();
                        const popped = this.chipsRef.current.pop();
                        if (popped) {
                            const { value: chip } = popped;
                            const { key = "", value = "", filter: { type } = {} } = chip;
                            switch (type) {
                                case FILTERS.POPER:
                                    this.setFilter(key, "", { noPoper: true });
                                    break;
                                default:
                                    if (SPECIAL_FILTER_TYPES.includes(type)) {
                                        setInputValue(this.inputRef, value);
                                        this.setState({ shadowText: "", isTextValid: true });
                                    } else {
                                        this.setFilter(key, value);
                                    }
                            }
                        }
                    }
                    break;
                default:
                    this.setState({ isTextValid: true });
                    break;
            }
        } else {
            const { key, filter = {} } = currentFilter;
            const { type, keyPreventer, validator } = filter;
            let executeKeyPreventer = false;
            let preventDefault = false;
            switch (e.key) {
                case "Backspace":
                    if (cval.length === 0) {
                        this.setState({ currentFilter: null, shadowText: "", isTextValid: true, inputType: "" }, () => { setInputValue(this.inputRef, key); });
                        preventDefault = true;
                    } else { executeKeyPreventer = true; }
                    break;
                case "Enter":
                    switch (type) {
                        case FILTERS.POPER:
                            this.showPopUpIfNecessary(filter);
                            break;
                        default:
                            let canProceed = true;
                            if (validator) {
                                canProceed = validator(cval);
                            } else {
                                canProceed = cval.trim() !== "";
                            }
                            if (canProceed && cval.length <= MAX_CHARACTER_LEN) {
                                if (this.addChip(key, cval, filter)) {
                                    e.target.value = "";
                                }
                            }
                    }
                    preventDefault = true;
                    break;
                default:
                    switch (type) {
                        case FILTERS.POPER:
                            switch (true) {
                                case SPECIAL_KEYS.includes(e.key):
                                    preventDefault = false;
                                    break;
                                default:
                                    this.showPopUpIfNecessary(filter);
                                    preventDefault = true;
                                    break;
                            }
                            break;
                        default:
                            executeKeyPreventer = true;
                    }
                    break;
            }
            if (preventDefault || (executeKeyPreventer && keyPreventer?.(e.key, cval))) {
                e.preventDefault();
            }
        }
    }

    onPaste = (e) => {
        const { currentFilter } = this.state;
        const pastedText = (e.clipboardData || window.clipboardData).getData('text').trim();
        const cval = e.target.value;
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const simulated = cval.slice(0, start) + pastedText + cval.slice(end);
        if (currentFilter !== null) {
            const { filter = {} } = currentFilter;
            const { pastePreventer, validator, type } = filter;
            switch (type) {
                case FILTERS.POPER:
                    e.preventDefault();
                    return;
                default:
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
                    break;
            }
        }
    }

    onBlur = (e) => {
        if (!this.parentRef.current.contains(e.relatedTarget)) {
            this.suggestionRef.current.setVisible(false);
        }
    }

    onFocus = (e) => {
        setInputValue(this.inputRef);
    }

    onSearch = () => {
        const { onSearch } = this.props;
        onSearch?.();
    }

    onInfoClick = () => {
        const { filterKeys } = this.state;
        this.POPUP.current?.showPopUp("List of available Filters", displayFilterItems, "", { props: { items: filterKeys } });
    }

    render() {
        const { placeHolder = "", css = "", style = {}, filters = {} } = this.props;
        const { currentFilter, shadowText, isTextValid, filterKeys = [], inputType = "" } = this.state;
        let filterKey = "";
        if (currentFilter) {
            filterKey = currentFilter.key + " : ";
        }
        return <div ref={this.parentRef} className={"input-group " + css} style={style} onBlur={this.onBlur} >
            <div className="form-control p-1 border-dark-subtle d-flex flex-wrap gap-1 align-items-center" style={{ minHeight: "23px" }} >
                <MultiRender key="chipsrow" ref={this.chipsRef} component={Chips} onUpdate={this.onUpdate} />
                <div className="d-flex flex-fill" style={{ minWidth: "300px" }}>
                    <div className={"align-content-center bg-body-secondary " + (filterKey ? "" : "visually-hidden")}><strong className="p-1">{filterKey}</strong></div>
                    <div className="d-grid p-1 flex-fill position-relative">
                        <div className="chipsShadowText p-0">{shadowText}</div>
                        <input ref={this.inputRef} key="inputText" className={"chipsSearchInput p-0" + (isTextValid ? "" : " border-bottom border-danger text-danger")} placeholder={placeHolder} maxLength={MAX_CHARACTER_LEN}
                            onKeyDown={this.onKeyDown} onChange={this.onChange} onPaste={this.onPaste} onFocus={this.onFocus} type={inputType}/>
                        <SuggestionList ref={this.suggestionRef} filters={filters} filterKeys={filterKeys} onSelect={this.onSuggestionClicked} />
                    </div>
                </div>
            </div>
            <button className="btn bi bi-info-circle btn-outline-secondary" onClick={this.onInfoClick}></button>
            <button className="btn bi bi-search btn-outline-primary" onClick={this.onSearch}></button>
        </div>
    }
}


function displayFilterItems({ items }) {
    return <ul className="list-group">
        {items.map((text, index) => (
            <li key={index} className="list-group-item">
                {text}
            </li>
        ))}
    </ul>;
}

function setInputValue(inputRef, value = undefined) {
    const inp = inputRef.current;
    if (inp) {
        if (value !== undefined) {
            inp.value = value;
        }
        if (inp.type !== "date") {
            inp.setSelectionRange(inp.value.length, inp.value.length);
        }
    }
}