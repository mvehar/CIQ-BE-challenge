import React, {useEffect, useState} from 'react';
import './Spreadsheet.css';
import * as spreadsheetService from "../../services/spreadsheet.service";
import {SpreadSheetData} from "../../models/SpreadSheetData";
import {SpreadsheetDisplayCells} from "../../models/SpreadsheetCells";
import EditCell from "../EditCell/EditCell";

interface IProps {
    width?: number;
    height?: number;
    sheet: SpreadSheetData
}

interface IState {
    currentSheet?: SpreadSheetData;
    cells: SpreadsheetDisplayCells;
    saving: boolean;
    rows: string[];
    cols: string[];
}

export default function Spreadsheet(props: IProps) {

    const [state, setState] = useState<IState>({
        cells: {},
        saving: false,
        rows: spreadsheetService.generateRows(props.height || 10),
        cols: spreadsheetService.generateCols(props.width || 10),
    })

    const updateCell = (col: string, row: string, value: string) => {
        setState((state) => ({...state, saving: true}))
        spreadsheetService.updateCell(state.cells, props.sheet, col, row, value).then(([sheet, updatedCells]) => {

            // Ignore backend refresh
            setState((state) => ({...state, saving: false, cells: updatedCells}))
        })
    }

    useEffect(() => {
        console.log("Preparing cells for sheet: ", props.sheet.id);
        setState((state) => ({...state, cells: {}}));
        setState((state) => ({...state, cells: spreadsheetService.prepareDisplayCells(props.sheet.cells)}))
    }, [props.sheet])

    if (!state.cells) return (<div>Loading</div>);

    return (
        <div className="Spreadsheet">
            <table className="Spreadsheet-table">
                <thead>
                <tr>
                    <th></th>
                    {state.cols.map(col => (
                        <th key={col}>{col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {state.rows.map(row => (
                        <tr key={row}>
                            <td className="Spreadsheet-row-head">{row}</td>
                            {state.cols.map(col => (
                                <td key={col}>
                                    <EditCell
                                        cell={state.cells && state.cells[col] && state.cells[col][row] ? state.cells[col][row] : null}
                                        updateCell={(value) => updateCell(col, row, value)}
                                    />
                                </td>
                            ))}
                        </tr>
                    )
                )}
                </tbody>
            </table>
            <div>{state.saving && 'Saving sheet'}</div>

        </div>
    );
}