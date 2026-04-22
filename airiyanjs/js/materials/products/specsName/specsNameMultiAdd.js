
import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../globals/constants";
import { SpecsGroupPicker } from "../specsGroup/specsGroupPicker";
import { stringNotNullOrEmpty } from "../../../utilities/validators";

const TitledText = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class SpecsNameMultiAdd extends React.Component {
    textRef = React.createRef(null);
    specsGroupRef = React.createRef(null);

    constructor(props) {
        super(props);
        this.state = { selectedGroupId: null, specs: [] };
    }

    async componentDidMount() {
        const { TOAST } = await importASL();
        this.TOAST = TOAST;
    }

    onGroupChange = (group) => {
        this.setState({ selectedGroupId: group?.id });
    }

    valueGetter = () => {
        const name = this.textRef.current?.getValue();
        const specsGroup = this.specsGroupRef.current?.getValue();
        return { name: name, id: specsGroup?.id };
    }

    postValidator = () => {
        if (!this.textRef.current?.isValid()) {
            this.TOAST.current?.showWarning("Failed", "Please enter a valid spec name.");
            return false;
        }
        if (!this.specsGroupRef.current?.isValid()) {
            this.TOAST.current?.showWarning("Failed", "Please select a specs group.");
            return false;
        }
        return true;
    }

    onSuccess = (data) => {
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.setState(prevState => ({
                specs: [{ name: this.textRef.current?.getValue(), id: Date.now() }, ...prevState.specs]
            }));
            this.textRef.current?.setValue("");
            this.textRef.current?.focus?.();
            this.TOAST.current?.showSuccess("Success", "Specs Name Added");
        } else {
            this.TOAST.current?.showMessage("Failed", message);
        }
    }

    render() {
        return (
            <div className="p-0">
                <div className="mb-2">
                    <SpecsGroupPicker ref={this.specsGroupRef} onChange={this.onGroupChange} />
                </div>
                <div className="input-group mb-2">
                    <TitledText ref={this.textRef} placeholder="Spec Name" validator={stringNotNullOrEmpty} />
                    <PostButton
                        url="/service/specs_name/add"
                        valueGetter={this.valueGetter}
                        validator={this.postValidator}
                        onSuccess={this.onSuccess}
                        className="btn-primary">
                        Add
                    </PostButton>
                </div>
                <div className="mb-2">
                    <label className="fw-bold mb-0">Added Specs</label>
                    <hr />
                    <ul className="list-group">
                        {this.state.specs.map(spec => (
                            <li key={spec.id} className="list-group-item py-1">{spec.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}