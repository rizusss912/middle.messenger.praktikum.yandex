import { Data } from "./data.interface";

export type changePassword = undefined;
export type changeUser = undefined;

export interface UserState {
    changePassword: Data<changePassword>;
    changeUserData: Data<changeUser>;
}