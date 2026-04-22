import React from "react";
import { uuidv4 } from '../utilities/uuidv4'
import { AutoRender } from "../utilities/rendering";
import { SpinLoader } from "../commonComponents/spinner";

export class PostTButton extends React.Component {
    inputRef = React.createRef(null);
    constructor(props) {
        super(props);
        const { checked = false, disabled = false } = this.props;
        this.state = { checked, loading: false, disabled, uuid: uuidv4() };
    }

    componentDidMount() {
        const { callOnMount = false } = this.props;
        if (callOnMount) {
            this.postApiCall();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { onDisabled } = this.props;
        if (prevState.loading !== this.state.loading || prevState.disabled != this.state.disabled) {
            const isDisabled = this.state.loading || this.state.disabled;
            if (onDisabled) {
                onDisabled(isDisabled);
            }
        }
    }

    setDisabled = (disabled) => {
        this.setState({ disabled });
    }

    processSuccess = (data) => {
        const { onSuccess } = this.props;
        if (onSuccess) {
            try {
                onSuccess(data);
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({ loading: false });
    }

    processError = (err) => {
        const { onError } = this.props;
        if (onError) {
            try {
                onError(err);
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({ loading: false });
    }

    postApiCall = (e) => {
        this.setState({ checked: e.target.checked });
        const { url = "", valueGetter, validator } = this.props;
        const proceed = validator ? validator() : true;
        if (proceed && valueGetter) {
            this.setState({ loading: true });
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: valueGetter ? JSON.stringify(valueGetter()) : "{}"
            }
            ).then(res => {
                if (!res.ok) {
                    return res.json().then(errorBody => {
                        const err = new Error("Request failed");
                        err.status = res.status;
                        err.body = errorBody;
                        throw err;
                    });
                }
                return res.json();
            }).then(this.processSuccess).catch(this.processError);
        }
    }

    getValue = () => {
        return this.inputRef.current?.checked;
    }

    setValue = (checked = false) => {
        this.setState({ checked });
    }

    render() {
        const { lvarient = "text-light", text, children = "" } = this.props;
        const { disabled, loading, checked, uuid } = this.state;
        let lodingContent = "";
        if (loading) {
            lodingContent = <SpinLoader additionsClass={lvarient} ></SpinLoader>
        }
        return (
            <div className="form-check form-switch align-content-center">
                <input ref={this.inputRef} className="form-check-input" type="checkbox" id={uuid} key={uuid} onChange={this.postApiCall} disabled={loading || disabled} defaultChecked={checked} />
                <label className="form-check-label" for={uuid}>
                    {lodingContent}
                    {text ? AutoRender(text, { checked }) : children}
                </label>
            </div>
        );
    }
}