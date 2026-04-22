import React from "react";

export class ImageSelector extends React.Component {
    imageFileRef = React.createRef();
    imageDisplayRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = { validClass: "" };
    }

    isValid = () => {
        const { validator } = this.props;
        let res = true;
        const files = this.imageFileRef.current?.files;
        if (validator) {
            res = validator(files);
        } else {
            res = files ? files.length > 0 : false;
        }
        this.setValid(res);
        return res;
    };

    setValid = (valid) => {
        this.setState({
            validClass: valid ? "is-valid" : "is-invalid"
        });
    };

    getValue = () => {
        return this.imageFileRef.current?.files[0];
    };

    onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (this.imageDisplayRef.current) {
                    this.imageDisplayRef.current.src = reader.result;
                }
            };
            reader.readAsDataURL(file);
        }
        this.isValid();
    };

    render() {
        const { css = "", style = {}, imageProps = {}, accept = "image/*" } = this.props;
        const { maxHeight, maxWidth, alt = "", css: imageCss = "" } = imageProps;
        const { validClass } = this.state;

        return (
            <div className={"h-100 d-flex flex-column " + css} style={style}>
                <div className="card p-1 flex-fill d-flex align-items-center justify-content-center">
                    <img ref={this.imageDisplayRef} className={imageCss} style={{ maxHeight, maxWidth }} width="100%" height="100%" alt={alt} />
                </div>
                <div className="input-group mt-1">
                    <input ref={this.imageFileRef} className={`${validClass} form-control`} type="file" accept={accept} onChange={this.onFileChange} />
                </div>
            </div>
        );
    }
}