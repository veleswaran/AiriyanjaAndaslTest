import React from "react";
import { SearchBeamGroup } from "./searchBeamGroup";

export class BgPage extends React.Component {
    beamGroupRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    render() {
        return <div className="row m-0">
            <div className="col">
                <SearchBeamGroup ref={this.beamGroupRef} />
            </div>
        </div>;
    }
}