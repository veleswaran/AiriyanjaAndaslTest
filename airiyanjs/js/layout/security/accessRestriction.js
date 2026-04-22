import { Navigate, useLocation, useMatches } from "react-router-dom";
import { USER_CATEGORY } from "../../enums/categoryEnum";
import { canAccess } from "./accessLogic";


export function AccessRestriction(params) {
    const { children, businessData = {}, isLoggedIn } = params;
    const { category: bCategory, businessUser: { category: userCategory = '', accessLimit: userAccessLimit = [] } = {} } = businessData;
    const location = useLocation();
    const matches = useMatches();
    for (const match of matches) {
        const { handle: { category = [], loggedUser, accessLimit = [] } = {} } = match;
        if (loggedUser && !isLoggedIn) {
            return <Navigate to="/notfound" replace />;
        }
        const accessAllowed = canAccess(businessData, category, accessLimit);
        if (!accessAllowed) {
            return <Navigate to="/notfound" replace />;
        }
    }
    for (const match of [...matches].reverse()) {
        const { handle: { title } = {} } = match;
        if (title) {
            document.title = title;
            break;
        }
    }
    return <>{children}</>;
}