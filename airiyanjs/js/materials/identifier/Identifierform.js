import React from "react";
import { GetAslModules } from "../../utilities/utilities";
import { importASL } from "../../utilities/utilities";

const TitledText = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");
const TitledSelect = GetAslModules("TitledSelect");

export class Identifierform extends React.Component {
    textRef = React.createRef(null);
    selectRef = React.createRef(null);

    constructor(props) {
        super(props);
    }
    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }
    textValidator = (data) => {
        const { textValidator } = this.props;
        if (textValidator) {
            return textValidator(data);
        }
        return true;
    };

    valueGetter = () => {
        const name = this.textRef.current?.getValue();
        const dataType = this.selectRef.current?.getValue();
        const finalVal = { name, dataType };   
        return finalVal;
    };

    postValidator = () => {
        const isTextValid = this.textRef.current?.isValid();
        const isSelectVal = this.selectRef.current?.isValid();
        if(!isTextValid){
            this.TOAST.current?.showWarning("Error", "Enter the Identifier name");
        }
        if(!isSelectVal){
            this.TOAST.current?.showWarning("Error", "Select Data Type");
        }
        return isTextValid && isSelectVal;
    };

    onDisabled = (disabled) => {
        this.textRef.current?.setDisabled(disabled);
    };

    render() {
        const { placeholder, buttonText, onSuccess, onError, url = "", label } = this.props;
        return (
            <div className="w-100">
                <div className="input-group d-flex justify-content-center">
                    <TitledSelect ref={this.selectRef} placeholder="Select Data Type" options={["TEXT", "NUMBER", "ALPHA_NUMERIC"]} />
                </div>
                <div className="input-group mt-1">
                    {label ? <span className="input-group-text">{label}</span> : null}
                    <TitledText ref={this.textRef} placeholder={placeholder} validator={this.textValidator} />
                    <PostButton url={url} onDisabled={this.onDisabled} valueGetter={this.valueGetter} validator={this.postValidator} onSuccess={onSuccess} onError={onError} >
                        {buttonText}
                    </PostButton>
                </div>
            </div>
        );
    }
}
