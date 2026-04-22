import React from "react";
import { AutoRender } from "../utilities/rendering";
import { uuidv4 } from "../utilities/uuidv4";

export class MultiRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = { allControls: [], seq: 0, updateid: uuidv4() };
    }

    componentDidUpdate(prevProps, prevState) {
        const { onUpdate } = this.props;
        const { updateid } = this.state;
        if (prevState.updateid !== updateid) {
            onUpdate?.();
        }
    }

    add = (spec) => {
        this.state.seq = this.state.seq + 1;
        const nData = {
            id: this.state.seq,
            objRef: React.createRef(null),
            spec
        };
        this.state.allControls.push(nData);
        this.setState({ updateid: uuidv4() });
    }

    remove = (id) => {
        const { allControls } = this.state;
        const nallControls = [];
        for (const control of allControls) {
            if (control.id !== id) {
                nallControls.push(control);
            }
        }
        this.state.allControls = nallControls;
        this.setState({ updateid: uuidv4() });
    }

    pop = () => {
        const { allControls } = this.state;
        const poped = allControls.pop();
        if (poped !== undefined) {
            this.setState({ updateid: uuidv4() });
            const { objRef, spec } = poped;
            let value = objRef.current?.getValue();
            return { value, spec };
        }

        return null;
    }

    clear = () => {
        this.state.allControls = [];
        this.setState({ updateid: uuidv4() });
    }

    getConfigs = () => {
        const res = [];
        const { allControls } = this.state;
        for (const cont of allControls) {
            const { spec } = cont;
            res.push(spec);
        }
        return res;
    }

    refreshAll = (data) => {
        const { allControls } = this.state;
        for (const cont of allControls) {
            const { objRef } = cont;
            if (objRef.current?.refresh) {
                objRef.current.refresh(data);
            }
        }
    }

    refresh = (id, data) => {
        const { allControls } = this.state;
        for (const cont of allControls) {
            const { objRef } = cont;
            if (cont.id === id) {
                if (objRef.current?.refresh) {
                    objRef.current.refresh(data);
                    return true;
                }
                break;
            }
        }
        return false;
    }

    getValue = () => {
        const { allControls } = this.state;
        const res = [];
        for (const cont of allControls) {
            const { objRef } = cont;
            if (objRef.current) {
                res.push(objRef.current.getValue());
            }
        }
        return res;
    }

    isValid = () => {
        const { allControls } = this.state;
        for (const cont of allControls) {
            const { objRef } = cont;
            if (objRef.current.isValid && !objRef.current.isValid()) {
                return false;
            }
        }
        return true;
    }

    render() {
        const { component: defaultComponent } = this.props;
        const { allControls } = this.state;
        const allInputs = [];
        let serial = 0;
        for (const cnt of allControls) {
            serial++;
            const { spec: { component = defaultComponent, props }, id, objRef } = cnt;
            const { key, ref, onClose, ...nProps } = props;
            allInputs.push(AutoRender(component, {
                ...nProps, serial, key: id, ref: objRef, onClose: () => {
                    this.remove(id);
                    if (onClose) {
                        onClose(nProps);
                    }
                }
            }));
        }
        return allInputs;
    }
}