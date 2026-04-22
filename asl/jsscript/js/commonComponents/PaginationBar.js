import React from "react";
import { Pagination } from "react-bootstrap";


export class PaginationBar extends React.Component {
    constructor(props) {
        super(props);
        const { total = 0, limit = 0, from = 0 } = this.props
        this.state = { total, limit, from, isLoading: false };
    }

    update = (data) => {
        const { total = 0, limit = 0, from = 0, current = 0 } = data;
        let newLimit = limit;
        if (limit !== current & (from + current) < total) {
            newLimit = current;
        }
        this.setState({ total, limit: newLimit, from, isLoading: false });
    }

    setLoading = (enabled) => {
        this.setState({ isLoading: enabled });
    }

    handleClick = (pageNumber) => {
        const { limit } = this.state;
        const { callBack } = this.props;
        if (callBack) {
            callBack({ from: (pageNumber - 1) * limit });
        }
    }

    render() {
        const { pageBuffer = 10, style = "" } = this.props;
        const { total, limit, from, isLoading } = this.state;
        let content = [];
        if (total > 0) {
            const items = [];
            const remain = total % limit;
            const totalPage = ((total - remain) / limit) + (remain > 0 ? 1 : 0);
            const currentPage = ((from - (from % limit)) / limit) + 1;
            let s = currentPage > pageBuffer ? (currentPage - pageBuffer) : 1;
            let e = (currentPage + pageBuffer) >= totalPage ? totalPage : (currentPage + pageBuffer);
            for (let index = s; index <= e; index++) {
                items.push(<Pagination.Item key={index} disabled={isLoading} active={index === currentPage} onClick={() => this.handleClick(index)} >{index}</Pagination.Item>)
            }
            content = [
                <Pagination.First disabled={(currentPage == 1) || isLoading} onClick={() => this.handleClick(1)} />,
                <Pagination.Prev disabled={(currentPage == 1) || isLoading} onClick={() => this.handleClick(currentPage - 1)} />,
                items,
                <Pagination.Next disabled={(currentPage == totalPage) || isLoading} onClick={() => this.handleClick(currentPage + 1)} />,
                <Pagination.Last disabled={(currentPage == totalPage) || isLoading} onClick={() => this.handleClick(totalPage)} />
            ];
        } else {
            content = [
                <Pagination.First disabled={true} />,
                <Pagination.Prev disabled={true} />,
                <Pagination.Next disabled={true} />,
                <Pagination.Last disabled={true} />
            ];
        }
        return (
            <Pagination className={style}>
                {content}
            </Pagination>
        );
    }
}