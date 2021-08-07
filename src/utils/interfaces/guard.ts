export interface Guard {
    canOpen(): boolean | Promise<boolean>;
    onOpenError(): void;
    }