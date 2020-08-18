import * as api from "../apis/spreadsheet.api"
import {SpreadSheetData} from "../models/SpreadSheetData";
import {CellDisplay} from "../models/CellDisplay";
import {SpreadsheetCells, SpreadsheetDisplayCells} from "../models/SpreadsheetCells";

const REFERENCE_REGEX = /^([a-zA-Z]+)([\d]+)$/;

/**
 * Generate row indexes
 * @param length
 */
export function generateCols(length: number): string[] {
    return Array(length).fill(0).map((row, index) => {
        return generateColLetter(index);
    });
}

/**
 * Generate column indexes
 * @param length
 */
export function generateRows(length: number): string[] {
    return Array(length).fill(0).map((col, index) => String(index + 1))
}

/**
 *
 * @param displayCells
 * @param data
 * @param row
 * @param col
 * @param value
 */
export function updateCell(displayCells: SpreadsheetDisplayCells, data: SpreadSheetData, col: string, row: string, value: string): Promise<[SpreadSheetData, SpreadsheetDisplayCells]> {
    const cells: SpreadsheetDisplayCells = {...displayCells || {}};
    cells[col] = cells[col] || {};

    const oldValue = cells[col] && cells[col][row] ? cells[col][row].value : '';
    if (oldValue === value) {
        return Promise.resolve([data, displayCells]);
    }

    // Prepare updated cells data
    if (value) {
        cells[col] = {...cells[col], [row]: {col, row, value}};
    } else {
        delete cells[col][row];

        if (Object.keys(cells[col]).length === 0) {
            delete cells[col];
        }
    }

    const updatedCells = recalculateSheetDisplayData(cells, Date.now());

    const updatedData = {...data, cells: cleanCellsForApi(cells)}

    let apiPromise;
    if (data.id) {
        apiPromise = api.updateSpreadsheet(data.id, updatedData);
    } else {
        apiPromise = api.newSpreadsheet(updatedData)
    }

    // Save values to API
    return apiPromise.then(updatedSheet => {
        return [updatedSheet, updatedCells];
    });

}

/**
 * Function to convert api sheet.cell to display model
 * @param cells
 */
export function prepareDisplayCells(cells: SpreadsheetCells) {
    const displayCells = toDisplayCells(cells || {});

    return recalculateSheetDisplayData(displayCells, Date.now())
}

/**
 *
 * @param sheetId
 */
export function loadSpreadSheet(sheetId: string): Promise<SpreadSheetData> {
    return api.getSpreadsheet(sheetId)
}

/**
 * Get all spreadsheets
 */
export function loadSpreadSheets(): Promise<SpreadSheetData[]> {
    return api.getSpreadsheets()
}

/**
 * Create new draft sheet
 * @param title
 */
export function createNew(title?: string): SpreadSheetData {
    return {
        title: title || String(Date.now()),
        cells: {}
    }
}

/**
 * Generate row letter. Max up to 26 letters
 * @param position
 */
function generateColLetter(position: number): string {
    return String.fromCharCode(65 + (position % 26))
}

/**
 * Resolve dependencies between cells to display values
 * @param cells
 * @param index
 */
function recalculateSheetDisplayData(cells: SpreadsheetDisplayCells, index: number): SpreadsheetDisplayCells {
    let resolvedCells = cells;
    Object.keys(cells).forEach((columnKey) => {
        Object.keys(cells[columnKey]).forEach((rowKey) => {
            const cell = cells[columnKey][rowKey];

            const [updatedCells] = resolveCell(resolvedCells, cell, index)
            resolvedCells = updatedCells;
        })
    })

    return resolvedCells;
}

/**
 * Convert api object ot display structure - each cell as CellDisplay object
 * @param apiCells
 */
function toDisplayCells(apiCells: SpreadsheetCells): SpreadsheetDisplayCells {
    const displayCells: SpreadsheetDisplayCells = {};

    Object.keys(apiCells).forEach((columnKey: string) => {
        displayCells[columnKey] = {};

        Object.keys(apiCells[columnKey]).forEach((rowKey: number | string) => {
            displayCells[columnKey][rowKey] = {
                col: columnKey,
                row: rowKey,
                value: apiCells[columnKey][rowKey],
                display: undefined,
            } as CellDisplay;
        });
    });

    return displayCells;
}


/**
 * Convert display object to api object representing spreadsheet
 * @param cells
 */
function cleanCellsForApi(cells: SpreadsheetDisplayCells): SpreadsheetCells {
    const cleanCells: SpreadsheetCells = {};
    Object.keys(cells || {}).forEach((columnKey) => {
        cleanCells[columnKey] = {};

        Object.keys(cells[columnKey]).forEach((rowKey) => {
            const value = cells[columnKey][rowKey];

            const cleanValue = (typeof value === 'object') ? value.value : value;

            if (cleanValue) {
                cleanCells[columnKey][rowKey] = cleanValue;
            }
        })
    })
    return cleanCells;
}


/**
 *
 * @param inputCells
 * @param cell
 * @param index
 * @param depth
 */
function resolveCell(inputCells: SpreadsheetDisplayCells, cell: CellDisplay | null, index: number, depth = 1): [SpreadsheetDisplayCells, null | CellDisplay] {
    if (!cell || depth > 100) {
        return [inputCells, null];
    }

    // Already processed in this iteration
    if (cell.index === index) {
        return [inputCells, cell];
    }

    let cells = inputCells;
    let value = cell.value;
    cell.hasFormula = false;

    if (typeof value === 'string' && value.length > 0 && value.charAt(0) === '=') {
        cell.hasFormula = true;
        const formula = value.substring(1);

        const parts = formula.split('+');
        const numericParts: number[] = parts.map(part => {
            const trimmedPart = part.trim()
            const partNumeric = parseFloat(trimmedPart);
            if (isNaN(partNumeric)) {
                // must be reference to other cell
                const referencedCell = findCellByReference(cells, trimmedPart)
                const [updatedCells, referenceCell] = resolveCell(cells, referencedCell, index, depth + 1)
                cells = updatedCells;
                cell.hasError = !referenceCell;

                return referenceCell ? parseFloat((referenceCell.display || 0) as string) : 0
            } else {
                return partNumeric
            }
        })

        value = numericParts.reduce((sum, part) => sum + part, 0)
    }

    cell.display = String(value);
    cell.index = index;

    cells[cell.col][cell.row] = cell;

    return [cells, cell];
}

/**
 *
 * @param cells
 * @param reference
 */
function findCellByReference(cells: SpreadsheetDisplayCells, reference: string): CellDisplay | null {
    if (!REFERENCE_REGEX.test(reference)) {
        return null;
    }
    const [, col, row] = Array.from(reference.match(REFERENCE_REGEX) || []);

    return cells[col] && cells[col][row] ? cells[col][row] : null;
}