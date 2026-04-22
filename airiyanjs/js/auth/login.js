import React, { Component } from "react";
import { useOutletContext } from "react-router-dom";
import { GetAslModules, importASL, validateEmail } from "../utilities/utilities.js";
import { RESULT_SUCCESS } from "../globals/constants.js";

const TitledText = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class Login extends Component {
    constructor(props) {
        super(props);
        if (props.isLoggedIn) {
            window.location.replace("/");
        }
        this.state = { email: "", businessName: "", authCode: "", code: "", otpReceived: false };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getFormData = () => {
        const { email, businessName, authCode, code, otpReceived } = this.state;
        return otpReceived ? { code, authCode } : { email, businessName };
    };

    onChange = (value, target) => {
        this.setState({ [target.name]: value });
    };

    validator = () => {
        const { email, code, otpReceived } = this.state;
        if (otpReceived && !code) {
            this.TOAST.current.showFailed("Validation Error", "Enter Valid OTP");
            return false;
        }
        if (!otpReceived && !validateEmail(email)) {
            this.TOAST.current.showFailed("Validation Error", "Please enter valid Username (email)");
            return false;
        }
        return true;
    };

    onSuccess = (data) => {
        const { result, message, data: authData } = data;
        const { otpReceived } = this.state;

        if (otpReceived) {
            if (result === RESULT_SUCCESS) window.location.replace("/");
            else this.TOAST.current.showFailed("Error", message);
        } else {
            if (result === RESULT_SUCCESS) {
                this.POPUP.current.showSuccess("Success", "OTP sent to your email", () => {
                    this.setState({ authCode: authData, otpReceived: true });
                });
            } else {
                this.TOAST.current.showFailed("Error", message || "Incorrect user name or password");
            }
        }
    };

    onError = (err) => {
        const { responseJSON = {} } = err;
        const { message } = responseJSON;
        this.TOAST.current.showFailed("Error", message || "Something went wrong");
    };

    render() {
        const { otpReceived, email, businessName } = this.state;

        const poProps = {
            url: otpReceived ? "/service/session/validateOtp" : "/service/session/signin",
            onError: this.onError,
            onSuccess: this.onSuccess,
            valueGetter: this.getFormData,
        };

        return (
            <div className="container h-100 align-content-center mt-3" style={{ width: "max-content", minWidth: "400px" }}>
                <h1 className="h3 mb-3 fw-normal text-center">Sign-in</h1>
                <div className="card bg-white mx-auto mt-1 p-2">
                    {otpReceived ? (
                        <>
                            <span className="text-black-50 small m-2">{email}</span>
                            <span className="text-black-50 small m-2">{businessName}</span>
                            <TitledText placeholder="OTP" type="text" name="code" class="mt-1" onChange={this.onChange} />
                            <div className="d-flex justify-content-end">
                                <PostButton {...poProps} validator={this.validator} css="mt-2">Submit</PostButton>
                            </div>
                        </>
                    ) : (
                        <>
                            <TitledText placeholder="Email" type="email" name="email" class="mt-1" onChange={this.onChange} />
                            <TitledText placeholder="Business Name" type="text" name="businessName" class="mt-1" onChange={this.onChange} />
                            <div className="d-flex justify-content-end">
                                <PostButton {...poProps} validator={this.validator} css="mt-2">Get OTP</PostButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export function LoginWithContext(props) {
    const { isLoggedIn, businessData } = useOutletContext();
    return <Login {...props} isLoggedIn={isLoggedIn} businessData={businessData} />;
}
