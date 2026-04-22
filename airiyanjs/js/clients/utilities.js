
import { Col, Row } from "react-bootstrap";
import { filterObject, objectToArray } from "../utilities/objectUtils";

export const ADDRESS_GROUP = ['ADDRESS_LINE1', 'ADDRESS_LINE2'];
export const LOCATION_GROUP = ['CITY', 'STATE', 'COUNRTY', 'PINCODE'];
export const MAJOR_ADDRESS_GROUP = ['ADDRESS_LINE1', 'ADDRESS_LINE2', 'CITY'];
export const MAIN_LOCATION_GROUP = ['STATE', 'COUNRTY'];
export const CONTACT_GROUP = ['EMAIL', 'MOBILE', "GST"];
export const CONTACT_GROUP_FOR_LOOM = ['EMAIL', "GST"];


export function renderAddress(data) {
    const allAddress = [];
    [ADDRESS_GROUP, LOCATION_GROUP].forEach(group => {
        const gValue = [];
        group.forEach(key => {
            if (data[key]) {
                gValue.push(data[key]);
            }
        });
        if (gValue) {
            allAddress.push(<div>{gValue.join(" , ")}</div>);
        }
    });
    return allAddress;
}

export function renderContact(data) {
    const allDetails = [];
    CONTACT_GROUP.forEach(key => {
        if (data[key]) {
            allDetails.push(
                <Row><Col className="flex-grow-0 fw-semibold">{key.toLowerCase()}:</Col><Col>{data[key]}</Col></Row>
            );
        }
    });
    return <div>{allDetails}</div>;
}


export function getDefaultClientDetail(client) {
    const { details = [] } = client;
    for (const detail of details) {
        if (detail.isDefault) {
            return detail;
        }
    }
    if (details.length > 0) {
        return details[0];
    }
    return {};
}