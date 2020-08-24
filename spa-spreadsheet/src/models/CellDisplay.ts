export interface CellDisplay {
    col: string;
    row: string;
    value: string | number;
    display?: null | string;

    index?: number;
    hasFormula?: boolean;
    hasError?: boolean;
}