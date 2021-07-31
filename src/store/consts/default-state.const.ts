import { getDefaultData } from "../functions/get-default-data";
import { State } from "../interfaces/state.interface";
import { userData } from "../interfaces/user-data-state.interface";

export const defaultState: State = {
    userData: getDefaultData<userData>(),
}