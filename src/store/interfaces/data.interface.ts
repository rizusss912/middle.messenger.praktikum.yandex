import {dataStatus} from '../enums/data-status.enum';

export interface Data<T> {
    status: dataStatus;
    error: Error | undefined;
    time: number | undefined;
    value: T | undefined;
}
