import { Data } from "../../interfaces/data.interface";

export function selectDataValue<T>(data: Data<T>): T | undefined {
    return data.value;
}