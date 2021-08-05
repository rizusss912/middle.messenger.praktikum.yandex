import { getDefaultData } from "../functions/get-default-data";
import { State } from "../interfaces/state.interface";
import { authToken, logout, userData } from "../interfaces/authorization-state.interface";

export const defaultState: State = {
    authorization: {
        authToken: getDefaultData<authToken>(),
        logout: getDefaultData<logout>(),
        userData: getDefaultData<userData>(),
    }
}