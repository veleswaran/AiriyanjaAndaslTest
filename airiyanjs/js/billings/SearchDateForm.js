import React from "react";
import { Button } from "react-bootstrap";
import { GetAslModules } from "../utilities/utilities";
import { ClientPicker } from "../clients/clientPicker";

const TitledText = GetAslModules("TitledTextBox");

export class SearchDateForm extends React.Component {
    clientRef = React.createRef();
    billRef = React.createRef();
    startDateRef = React.createRef();
    endDateRef = React.createRef()

    constructor(props) {
        super(props);
        this.state = ({ billNumber: "", startDate: "", endDate: "" })
    }

    handleChange = (value, e) => {
        this.setState({ [e.name]: value });
    };

    onClick = () => {
        const { billNumber, startDate, endDate } = this.state;
        const { onClick } = this.props;
        if (onClick) {
            onClick({ billNumber, startDate, endDate, clientDetailId: this.clientRef.current.getValue()?.id });
        }
    };

    getValue = () => {
        const { billNumber, startDate, endDate } = this.state;
        return { billNumber, startDate, endDate, clientDetailId: this.clientRef.current.getValue()?.id };
    }

    onReset = () => {
        this.billRef?.current?.reset();
        this.startDateRef?.current?.reset();
        this.endDateRef?.current?.reset();
        this.clientRef?.current?.handleClearClient();
        this.props.onClick({});
    }

    render() {
        const { clientUrl, printNeeded = false, onPrintClick, baseUrl, clientType, businessData } = this.props

        return (
            <>
                <ClientPicker ref={this.clientRef} url={clientUrl} baseUrl={baseUrl} clientType={clientType} businessData={businessData} />
                <div className="w-100 mx-auto p-0 align-items-center" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                    <TitledText ref={this.billRef} type="text" name="billNumber" placeholder="Bill Number" label="Bill Number" onChange={this.handleChange} class="mt-1 rounded-0" />
                    <TitledText ref={this.startDateRef} type="date" name="startDate" placeholder="Start Date" label="Start Date" onChange={this.handleChange} class="mt-1 rounded-0" />
                    <TitledText ref={this.endDateRef} type="date" name="endDate" placeholder="End Date" label="End Date" onChange={this.handleChange} class="mt-1 rounded-0" />
                    <div className="text-end mt-1">
                        <button className={"btn btn-outline-secondary bi bi-printer me-1 " + (printNeeded ? "" : "visually-hidden")} onClick={onPrintClick} />
                        <Button variant="outline-secondary me-1" onClick={this.onReset}>Reset</Button>
                        <Button variant="primary" onClick={this.onClick}>Search</Button>
                    </div>
                </div>
            </>
        );
    }
}
