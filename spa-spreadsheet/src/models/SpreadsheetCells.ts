import {CellDisplay} from "./CellDisplay";

export interface SpreadsheetCells {
    [key: string]: { [key: string]: number | string }
}

export interface SpreadsheetDisplayCells {
    [key: string]: { [key: string]: CellDisplay }
}