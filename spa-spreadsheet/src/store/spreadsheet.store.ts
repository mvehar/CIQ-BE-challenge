import {SpreadSheetData} from "../models/SpreadSheetData";
import {SpreadsheetDisplayCells} from "../models/SpreadsheetCells";
import {BehaviorSubject} from "rxjs";

export interface ISpreadsheetState {
    cells: SpreadsheetDisplayCells;
    sheet: SpreadSheetData | null;
}

export const initialState: ISpreadsheetState = {sheet: null, cells: {}}

const state$ = new BehaviorSubject<ISpreadsheetState>(initialState);

const spreadsheetStore = {
    initialState,
    subscribe: (setState: (value: ISpreadsheetState) => void) => state$.subscribe(setState),
    init: (state: ISpreadsheetState) => state$.next(state),
    setSheet: (sheet: SpreadSheetData | null) => {
        state$.next({...state$.value, sheet})
    },
    setCells: (cells: SpreadsheetDisplayCells) => {
        state$.next({...state$.value, cells})
    }
}

export default spreadsheetStore