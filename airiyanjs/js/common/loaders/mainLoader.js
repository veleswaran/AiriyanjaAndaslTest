import { useMatches } from "react-router-dom";


export function mainLoader(params) {
    const { context = {} } = params;
    // We can do preprocessing
    return { context };
}