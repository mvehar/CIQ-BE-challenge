import {SpreadsheetCells} from "./SpreadsheetCells";

export interface SpreadSheetData {
    id?: string;
    title: string;
    cells: SpreadsheetCells;
    date_created?: string;
    date_updated?: string;
}