
import { RESULT_SUCCESS } from "../../globals/constants";

export async function authMiddleware(params) {
  const { context } = params;
  const response = await fetch("/service/entities/details");
  if (!response.ok) {
    throw new Response("Somthing went wrong", { status: 500 });
  }
  const bData = await response.json();
  const { result, data } = bData;
  context.isLoggedIn = result === RESULT_SUCCESS;
  context.businessData = context.isLoggedIn ? data : {};
  return null;
}
