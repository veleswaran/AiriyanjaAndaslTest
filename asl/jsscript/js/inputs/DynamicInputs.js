import React from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";

export class DynamicInputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = { seq: 0, addedInputs: [], addables: [], originalInputs: [] };
        this.inputRefs = {};
    }

    componentDidMount() {
        const { inputs = [] } = this.props;
        const names = new Set();
        const newInputs = [];
        for (const input of inputs) {
            const { name = "" } = input;
            if (names.has(name)) {
                console.log("Found duplicate input - " + name);
            } else {
                newInputs.push(input);
                names.add(name);
            }
        }
        const mandatories = [];
        for (const inp of newInputs) {
            const { isUnique = false, isMandatory = false } = inp;
            if (isUnique && isMandatory) {
                mandatories.push(inp);
            }
        }
        this.setState({ originalInputs: newInputs }, () => { this.changeAddables(); this.addInputs(mandatories); });
    }

    addInputs = (inputs) => {
        const { seq, addedInputs } = this.state;
        if (!inputs || inputs.length === 0) {
            return;
        }
        let newSeq = seq;
        const newAddedInputs = [...addedInputs];
        for (const input of inputs) {
            newSeq++;
            newAddedInputs.push({ id: newSeq.toString(), input });
        }
        this.setState({ seq: newSeq, addedInputs: newAddedInputs }, this.changeAddables);
    }

    addInput = (input) => {
        this.setState(
            (prev) => {
                const newSeq = prev.seq + 1;
                return { seq: newSeq, addedInputs: [...prev.addedInputs, { id: newSeq.toString(), input }] };
            },
            this.changeAddables
        );
    }

    removeInput = (id) => {
        this.setState(
            (prev) => ({
                addedInputs: prev.addedInputs.filter((inp) => inp.id !== id)
            }),
            this.changeAddables
        );
    }

    changeAddables = () => {
        const { originalInputs, addedInputs } = this.state;
        const addables = [];
        for (const inp of originalInputs) {
            const { isUnique = false, name = "" } = inp;
            if (isUnique) {
                let canAdd = true;
                for (const cnt of addedInputs) {
                    if (cnt.input.name === name) {
                        canAdd = false;
                        break;
                    }
                }
                if (canAdd) {
                    addables.push(inp);
                }
            } else {
                addables.push(inp);
            }
        }
        this.setState({ addables });
    }

    isValid = () => {
        const { addedInputs } = this.state;
        for (const cont of addedInputs) {
            const { id } = cont;
            if (!this.inputRefs[id]?.isValid()) {
                return false;
            }
        }
        return true;
    }

    isAllValid = () => {
        return this.isValid();
    }

    setValid = (key, valid) => {
        const { addedInputs } = this.state;
        for (const cont of addedInputs) {
            const { id, input: { name } } = cont;
            if (name === key) {
                this.inputRefs[id]?.setValid(valid);
            }
        }
    }

    getValue = () => {
        const { addedInputs } = this.state;
        const res = new Map();
        for (const cont of addedInputs) {
            const { id, input: { name } } = cont;
            if (!res.has(name)) {
                res.set(name, []);
            }
            res.get(name).push(this.inputRefs[id]?.getValue());
        }
        return res;
    }

    setValue = (valuesMap) => {
        if (!(valuesMap instanceof Map)) return;
        const { originalInputs, addedInputs } = this.state;
        const newAddedInputs = [...addedInputs];
        let newSeq = this.state.seq;

        valuesMap.forEach((values, key) => {
            const inputDef = originalInputs.find(inp => inp.name === key);
            if (inputDef) {
                const existing = newAddedInputs.filter(inp => inp.input.name === key);
                const countNeeded = values.length - existing.length;

                for (let i = 0; i < countNeeded; i++) {
                    newSeq++;
                    newAddedInputs.push({ id: newSeq.toString(), input: inputDef });
                }
            }
        });

        this.setState({ seq: newSeq, addedInputs: newAddedInputs }, () => {
            this.changeAddables();
            setTimeout(() => {
                valuesMap.forEach((values, key) => {
                    let valIdx = 0;
                    for (const cont of this.state.addedInputs) {
                        const { id, input: { name } } = cont;
                        if (name === key && values[valIdx] !== undefined) {
                            this.inputRefs[id]?.setValue?.(values[valIdx]);
                            valIdx++;
                        }
                    }
                });
            }, 100);
        });
    }


    render() {
        const { addables, addedInputs } = this.state;
        const { name: buttonName = "Add", style } = this.props;
        const selects = [];
        for (const inp of addables) {
            const { name = "" } = inp;
            selects.push(
                <Dropdown.Item onClick={() => { this.addInput(inp); }}>{name}</Dropdown.Item>
            );
        }
        const allInputs = [];
        for (const aInp of addedInputs) {
            const { id, input: { component, props, isUnique = false, isMandatory = false } = {} } = aInp;
            if (component) {
                allInputs.push(
                    <div className="row m-1" key={id}>
                        <div className="col p-0">
                            {React.createElement(component, { ...props, ref: (el) => (this.inputRefs[id] = el) })}
                        </div>
                        <div className="col-1 align-content-center text-center">
                            <button className={"btn btn-secondary btn-close" + (isMandatory && isUnique ? " disabled" : "")} onClick={() => { this.removeInput(id) }}></button>
                        </div>
                    </div>
                );
            }
        }
        return <div className={style ? style : "card p-1"}>
            <div className="w-100">
                {allInputs}
            </div>
            <ButtonGroup className="w-100">
                <Dropdown name="test" className="w-100">
                    <Dropdown.Toggle variant="secondary" className="w-100">
                        {buttonName}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                        {selects}
                    </Dropdown.Menu>
                </Dropdown>
            </ButtonGroup>
        </div>
    }

}