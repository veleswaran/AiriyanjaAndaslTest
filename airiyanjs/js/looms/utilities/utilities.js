export function getWeftName(clientWeft) {
    const { specDetails } = clientWeft || {};
    const cls = [];
    for (const spd of specDetails) {
        const { name, specGroup: { name: sgName } = {} } = spd;
        cls.push(<span><strong> {sgName} : </strong>{name}</span>);
    }
    return cls;
}