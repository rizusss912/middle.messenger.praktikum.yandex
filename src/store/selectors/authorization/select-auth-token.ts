import { authToken } from "../../interfaces/authorization-state.interface";
import { Data } from "../../interfaces/data.interface";
import { State } from "../../interfaces/state.interface";

export function selectAuthToken(state: State): Data<authToken> {
    return state.authorization.authToken;
}