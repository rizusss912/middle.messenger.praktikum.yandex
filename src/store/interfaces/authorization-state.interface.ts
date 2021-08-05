import { Data } from "./data.interface";

export type authToken = undefined;
export type logout = undefined;

export interface userData {
    first_name: string;
    second_name: string;
    display_name: string;
    avatarUrl: string;
    email: string;
    login: string;
    phone: string;
}

export type AuthorizationState = {
    authToken: Data<authToken>;
    logout: Data<logout>;
    userData: Data<userData>;
}