import React from "react";
import { GetAslModules } from "../utilities/utilities";

const TitledText = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class SingleTextForm extends React.Component {
    textRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    textValidator = (data) => {
        const { textValidator } = this.props;
        if (textValidator) {
            return textValidator(data);
        }
        return true;
    }

    valueGetter = () => {
        const { dataModifier } = this.props;
        const name = this.textRef.current?.getValue();
        const finalVal = { name };
        if (dataModifier) {
            return dataModifier(finalVal);
        }
        return finalVal;
    }

    postValidator = () => {
        return this.textRef.current?.isValid();
    }

    onDisabled = (disabled) => {
        this.textRef.current?.setDisabled(disabled);
    }

    render() {
        const { placeholder, buttonText, onSuccess, onError, url = "", className = "", label } = this.props;

        return (
            <div className={"card bg-white p-2 " + className} style={{ width: "max-content" }}>
                <div className="input-group">
                    {label ? <span class="input-group-text">{label}</span> : ""}
                    <TitledText ref={this.textRef} placeholder={placeholder} validator={this.textValidator} />
                    <PostButton url={url} onDisabled={this.onDisabled} valueGetter={this.valueGetter}
                        validator={this.postValidator} onSuccess={onSuccess} onError={onError}> 
                        {buttonText}
                    </PostButton>
                </div>
            </div>
        );
    }
}