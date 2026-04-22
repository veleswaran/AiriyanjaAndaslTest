import React from "react";
import { LoomedClothSearch } from "../loomedClothSearch";
import { importASL } from "../../../utilities/utilities";
import { LoomedClothAdd } from "../loomedClothAdd";
import { ClientView } from "../../../clients/clientView";


export class ViewClothChallan extends React.Component {
    loomedClothRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onAddSuccess = () => {
        this.loomedClothRef.current?.callZero();
    }

    showLoomedClothAdd = () => {
        const { data = {} } = this.props;
        const { clientId, id } = data;
        const query = { clientId };
        this.POPUP.current.showPopUp("Add Loomed Cloth", LoomedClothAdd, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { challanId: id, query, onSuccess: this.onAddSuccess } });
    }

    render() {
        const { css = "", style = {}, data = {} } = this.props;
        const { id, client } = data;
        return <div className={css} style={style}>
            <div>
                <button className="btn btn-sm btn-primary" onClick={this.showLoomedClothAdd}>Add Cloth</button>
            </div>
            <div className="my-1">
                <ClientView client={client} clientDetail={client.details?.[0]} buttonNeeded={false} />
            </div>
            <LoomedClothSearch ref={this.loomedClothRef} query={{ challanId: id }} />
        </div>;
    }
}