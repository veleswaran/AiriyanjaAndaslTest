import React from "react";
import { MultiView } from "../../views/MultiView";
import { MultiRender } from "../../commonComponents/MultiRender";

export class SearchLooper extends React.Component {
    view = React.createRef(null);
    constructor(props) {
        super(props);
        const { query = {} } = this.props;
        this.state = { query };
    }

    async componentDidMount() {
        await this.fetchAll();
    }

    fetchAll = async () => {
        const { limit = 100, url = "", dataProcessor, onError } = this.props;
        const { query = {} } = this.state;
        if (url) {
            let gfrom = 0;
            let gtotal = null;
            while (gtotal === null || gfrom < gtotal) {
                const requestOption = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ from: gfrom, limit, ...query })
                };
                const response = await fetch(url, requestOption);
                if (response.ok) {
                    const json = await response.json();
                    const { from = 0, data = [], total = 0 } = dataProcessor ? dataProcessor(json) : json;
                    gfrom = from + data.length;
                    gtotal = total;
                    if (data.length <= 0) {
                        break;
                    }
                    for (const datum of data) {
                        this.view.current.add({ props: { data: datum } });
                    }
                } else {
                    if (onError) {
                        onError(error);
                    }
                    this.view.current.clear();
                }
            }
        }
    }

    render() {
        const { component } = this.props;
        return (
            <MultiRender ref={this.view} component={component} />
        );
    }
}