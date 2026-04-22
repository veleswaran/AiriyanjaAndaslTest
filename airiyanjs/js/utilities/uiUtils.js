export const formateAmount = (amount) => {
    if (amount == 0) {
        return <span>{amount}</span>;
    } else {
        return amount > 0 ? <span className="text-success">{amount}</span> : <span className="text-danger">{amount}</span>;
    }
}


export const sanitizeForFilePath = (input) => {
    return input.replace(/[/\\?%*:|"<>]/g, '-').trim();
}