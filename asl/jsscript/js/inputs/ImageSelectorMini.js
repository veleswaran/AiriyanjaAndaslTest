import React from "react";
import { POPUP } from "../app";

export class ImageSelectorMini extends React.Component {
    imageFileRef = React.createRef();
    imageDisplayRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = { validClass: "" };
    }

    async componentDidMount() {
        this.POPUP = POPUP;
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

    showImage = () => {
        const file = this.imageFileRef.current?.files[0];
        if (file && this.isValid()) {
            this.POPUP.current.showPopUp("Image", ImageShower, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { file, css: "justify-content-center d-flex align-content-center" } });
        }
    }

    render() {
        const { title = "", css = "", style = {}, accept = "image/*" } = this.props;
        const { validClass } = this.state;
        return (
            <div className={"input-group " + css} style={style}>
                <label className="input-group-text">{title}</label>
                <input ref={this.imageFileRef} className={`${validClass} form-control`} type="file" accept={accept} onChange={this.onFileChange} />
                <button className="btn btn-primary" onClick={this.showImage}>View</button>
            </div>
        );
    }
}


class ImageShower extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: "" };
        const { file } = this.props;
        if (file) {
            var reader = new FileReader();
            reader.onloadend = this.loadImage;
            reader.readAsDataURL(file);
        }
    }

    loadImage = (evt) => {
        this.setState({ data: evt.target.result });
    }

    render() {
        const { css = "", imageProps: { css: imageCss = "", style: imageStyle = {} } = {} } = this.props;
        const { data } = this.state;
        return <div className={css}>
            <img className={"my-auto " + imageCss} src={data} style={imageStyle} />
        </div>
    }
}