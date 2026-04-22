import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { uuidv4 } from "../utilities/uuidv4";

export class FormPostButton extends React.Component {
    constructor(props) {
        super(props)
        const { disabled = false } = this.props;
        this.state = { loading: false, disabled, uuid: uuidv4() };
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


    postApiCall = () => {
        const { url = "", valueGetter, validator, needConfirmation = false, confirmMessage = "" } = this.props;
        let proceed = needConfirmation ? confirm(confirmMessage) : true;
        proceed = proceed ? (validator ? validator() : true) : proceed;
        if (proceed) {
            this.setState({ loading: true });
            fetch(url, {
                method: 'POST',
                headers: {},
                body: valueGetter ? valueGetter() : null
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


    render() {
        const { varient = "primary", size = "", lvarient = "", text, children, css = "" } = this.props;
        const { loading, disabled } = this.state;
        let loadingVarient = lvarient;
        if (loadingVarient === "") {
            if (varient === "light") {
                loadingVarient = "dark"
            } else {
                loadingVarient = "light";
            }
        }
        let lodingContent;
        if (loading) {
            lodingContent = <Spinner variant={loadingVarient} className="me-2" animation="border" size="sm" role="status"></Spinner>
        }
        return (
            <Button className={css} variant={varient} disabled={loading || disabled} size={size} onClick={this.postApiCall}>
                {loading ? lodingContent : ""}
                {text || children}
            </Button>
        );
    }
}
