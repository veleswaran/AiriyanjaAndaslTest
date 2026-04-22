import { USER_CATEGORY } from "../../enums/categoryEnum";


export function canAccess(businessData, pageCategory = [], pageAccessLimit = []) {
    let res = false;
    const { category: businessCategory = "", businessUser: { accessLimit = [], category: userCategory = "" } = {} } = businessData;
    if (pageCategory && pageCategory.length > 0) {
        res = pageCategory.includes(businessCategory);
    } else {
        res = true;
    }
    if (res && userCategory !== USER_CATEGORY.ADMIN && pageAccessLimit.length > 0) {
        res = false;
        for (const pal of pageAccessLimit) {
            if (accessLimit.includes(pal)) {
                res = true;
                break;
            }
        }
    }
    return res;
}