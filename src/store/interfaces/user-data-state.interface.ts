import { Data } from "./data.interface";

export interface userData {
    first_name: string;
    second_name: string;
    display_name: string;
    avatarUrl: string;
    email: string;
    login: string;
    phone: string;
}

export type UserDataState = Data<userData>;