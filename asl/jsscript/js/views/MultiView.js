import React from "react";
import { Col, Pagination, Row } from "react-bootstrap";
import { Card } from "react-bootstrap";


export class MultiView extends React.Component {
    constructor(props) {
        super(props);
        const { data = [] } = this.props;
        const { result = { from: 0, data }, currentView = 0 } = this.props;
        this.state = { result, currentView, isLoading: false }
        this.view = React.createRef(null);
    }

    changeView = (index) => {
        const { currentView, isLoading } = this.state;
        if (currentView !== index && !isLoading) {
            this.setState({ currentView: index });
            return true;
        }
        return false;
    }

    setData = (dta) => {
        this.state.isLoading = false;
        const { from, data } = dta;
        this.state.result = dta;
        if (this.view.current) {
            this.view.current.setData({ serialFrom: from, data });
        }
    }

    setLoading = (enabled) => {
        this.state.isLoading = enabled;
        if (this.view.current) {
            this.view.current.setLoading(enabled);
        }
    }

    render() {
        const { views = [] } = this.props;
        const { currentView, result: { from = 0, data = [] } = {} } = this.state;
        const { view, props = {} } = views[currentView];
        return React.createElement(view, { key: currentView, ref: this.view, serialFrom: from, data, ...props });;
    }
}

export class ViewSelecter extends React.Component {
    constructor(props) {
        super(props);
        const { currentView = 0 } = this.props;
        this.state = { currentView, disabled: false };
    }

    changeView = (index) => {
        const { viewRef } = this.props;
        const { currentView } = this.state;
        if (currentView !== index) {
            this.setState({ currentView: index });
            if (viewRef && viewRef.current) {
                viewRef.current.changeView(index);
            }
        }
    }

    setDisabled = (vl) => {
        this.setState({ disabled: vl });
    }

    render() {
        const { views = [] } = this.props;
        const { currentView = 0, disabled } = this.state;
        const icons = [];
        if (views.length > 1) {
            for (let index = 0; index < views.length; index++) {
                const { iconStyle = "" } = views[index];
                icons.push(<Pagination.Item key={index} disabled={disabled} linkClassName={iconStyle} active={index === currentView} onClick={() => { this.changeView(index) }}></Pagination.Item>)
            }
        }
        return (<Pagination className="pagination-sm m-0">{icons}</Pagination>);
    }
}