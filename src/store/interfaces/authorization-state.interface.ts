import { Data } from "./data.interface";

export type authToken = undefined;
export type logout = undefined;

export interface userData {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string | null;
    avatarUrl: string | null;
    email: string;
    login: string;
    phone: string;
}

export type AuthorizationState = {
    authToken: Data<authToken>;
    logout: Data<logout>;
    userData: Data<userData>;
}