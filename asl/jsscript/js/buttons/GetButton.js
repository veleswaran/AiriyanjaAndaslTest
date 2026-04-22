import React from "react";
import { Button, Spinner } from "react-bootstrap";

export class GetButton extends React.Component {
    constructor(props) {
        super(props)
        const { disabled = false } = this.props;
        this.state = { loading: false, disabled };
    }

    componentDidMount() {
        const { callOnMount = false } = this.props;
        if (callOnMount) {
            this.getApiCall();
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


    getApiCall = () => {
        this.setState({ loading: true });
        const { url = "", valueGetter } = this.props;
        const queryParam = new URLSearchParams(valueGetter ? valueGetter() : {});
        fetch(`${url}?${queryParam.toString()}`).then(res => {
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


    render() {
        const { varient = "primary", size = "", lvarient = "", text = "-", children, css = "" } = this.props;
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
            <Button className={css} variant={varient} disabled={loading || disabled} size={size} onClick={this.getApiCall}>
                {loading ? lodingContent : ""}
                {text || children}
            </Button>
        );
    }
}
