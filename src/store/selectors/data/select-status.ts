import { dataStatus } from "../../enums/data-status.enum";
import { Data } from "../../interfaces/data.interface";

export function selectDataStatus<T>(data: Data<T>): dataStatus {
    return data.status;
}