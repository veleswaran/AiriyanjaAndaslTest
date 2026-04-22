import React from "react";
import { SearchSpecsName } from "./searchSpecsName";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { SpecsSelectRow } from "./selecters/specsSelectRow";
import { PickerButton } from "../../../common/pickerButton";
import { uuidv4 } from "../../../utilities/uuidv4";

const MultiRender = GetAslModules("MultiRender");

export class SpecsSelecter extends React.Component {
    multiRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = { uuid: uuidv4() };
    }

    async componentDidMount() {
        const { POPUP, TOAST } = await importASL();
        this.POPUP = POPUP;
        this.TOAST = TOAST;
    }

    setDisabled = (disabled) => {
        this.setState({ disabled });
    }

    onUpdate = () => {
        const { onUpdate } = this.props;
        if (onUpdate) {
            onUpdate();
        }
    }

    onSelect = (data) => {
        const { onChange } = this.props;
        const { specGroup: { id } } = data;
        const allLis = this.multiRef.current.getValue();
        let canAdd = true;
        for (const ex of allLis) {
            if (id === ex.specGroup.id) {
                canAdd = false;
                break;
            }
        }
        if (canAdd) {
            this.multiRef.current.add({ props: { data } });
        } else {
            this.TOAST.current.showWarning("Cannot add", "One of the specs from the same group already added");
        }
    }

    getValue = () => {
        return this.multiRef.current.getValue();
    }

    clear = () => {
        this.multiRef.current.clear();
    }

    setValue = (specs = []) => {
        this.multiRef.current.clear();
        const seen = new Set();
        specs.forEach(spec => {
            const groupId = spec.specGroup.id;
            if (groupId && !seen.has(groupId)) {
                seen.add(groupId);
                this.multiRef.current.add({ props: { data: spec } });
            }
        });
    }

    render() {
        const { disabled = false, uuid } = this.state;
        const { css: { head = "", body = "" } = {}, style = {}, title = "Select Specs" } = this.props;
        return (<>
            <thead key={uuid + "th"} className={head}>
                <tr>
                    <th colSpan={2}>{title}</th>
                    <th className="text-end">
                        <PickerButton disabled={disabled} css="btn btn-sm btn-outline-primary bi bi-plus" searchComponent={SearchSpecsName} onSelect={this.onSelect}
                            modalProps={{ size: "xl", css: { footer: "visually-hidden" } }} title="Select specs name" />
                    </th>
                </tr>
                <tr className="table-group-divider"><th className="text-secondary">Group</th><th className="text-secondary">Name</th><th className="text-end text-secondary">Action</th></tr>
            </thead>
            <tbody key={uuid + "tb"} className={body}>
                <MultiRender ref={this.multiRef} onUpdate={this.onUpdate} component={SpecsSelectRow} />
            </tbody>
        </>);
    }
}


