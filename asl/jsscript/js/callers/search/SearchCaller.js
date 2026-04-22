import React from "react";
import { Card, Col, Row } from "react-bootstrap";

import { PaginationBar } from "../../commonComponents/PaginationBar";
import { MultiView, ViewSelecter } from "../../views/MultiView";

export class SearchCaller extends React.Component {
    constructor(props) {
        super(props);
        const { query = {} } = this.props;
        this.state = { query };
        this.paginationTop = React.createRef(null);
        this.paginationBottom = React.createRef(null);
        this.view = React.createRef(null);
        this.viewSelect = React.createRef(null);
    }

    componentDidMount() {
        this.callZero();
    }

    setQuery = (data) => {
        const { query = {} } = data;
        this.state.query = query;
        this.callZero();
    }

    callZero = () => {
        this.callApi({ from: 0 });
    }

    callPagination = (query) => {
        const { from } = query;
        this.callApi({ from });
    }

    callApi = (param) => {
        const { limit = 100, url = "", dataProcessor, onError } = this.props;
        const { query = {} } = this.state;
        const { from = 0 } = param;
        if (url) {
            const requestOption = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ from, limit, ...query })
            };
            this.paginationTop.current.setLoading(true);
            this.paginationBottom.current.setLoading(true);
            this.view.current.setLoading(true);
            this.viewSelect.current?.setDisabled(true);
            fetch(url, requestOption).then(async (response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }).then(async (respos) => {
                const { from = 0, data = [], total = 0 } = dataProcessor ? dataProcessor(respos) : respos;
                this.paginationTop.current.update({ from, limit, current: data.length, total });
                this.paginationBottom.current.update({ from, limit, current: data.length, total });
                this.view.current.setData({ from, data });
                this.viewSelect.current?.setDisabled(false);
            }).catch((error) => {
                if (onError) {
                    onError(error);
                }
                this.view.current.setData({ from: 0, data: [] });
                this.paginationTop.current.setLoading(false);
                this.paginationBottom.current.setLoading(false);
                this.viewSelect.current?.setDisabled(false);
            });
        }
    }

    render() {
        const { style = "", views = [], limit = 100, result: { from = 0, data = [], total = 0 } = {} } = this.props;
        return (
            <Card className={style}>
                <Card.Header>
                    <Row>
                        <Col className="p-0">
                            <ViewSelecter ref={this.viewSelect} views={views} viewRef={this.view} />
                        </Col>
                        <Col className="p-0">
                            <PaginationBar callBack={this.callPagination} ref={this.paginationTop} total={total} limit={limit} from={from} style="pagination-sm justify-content-end m-0" />
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className="p-0">
                    <MultiView ref={this.view} views={views} result={{ from, data }} />
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col className="p-0">
                            <PaginationBar callBack={this.callPagination} ref={this.paginationBottom} total={total} limit={limit} from={from} style="pagination-sm justify-content-end m-0" />
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        );
    }
}