import React, {useLayoutEffect, useState} from 'react';
import './App.css';
import {SpreadSheetData} from "../../models/SpreadSheetData";
import * as spreadsheetService from "../../services/spreadsheet.service";
import spreadsheetStore, {ISpreadsheetState} from "../../store/spreadsheet.store";
import Spreadsheet from "../../components/Spreadsheet/Spreadsheet";

interface IState {
    selectedSheet: SpreadSheetData | null;
    sheets: SpreadSheetData[];
    loading: boolean;
}

export default function App() {
    const [state, setState] = useState<IState>({
        selectedSheet: null,
        sheets: [],
        loading: false,
    });

    const storeUpdated = (storeState: ISpreadsheetState) => {
        if (storeState.sheet !== state.selectedSheet) {
            setState((state) => ({...state, selectedSheet: storeState.sheet}))
        }
    }

    const selectSpreadSheet = (sheetId: string) => {
        setState((state) => ({...state, loading: true}))
        spreadsheetService.loadSpreadSheet(sheetId).then((sheet) => {
                spreadsheetStore.setSheet(sheet)
                setState((state) => ({...state, loading: false}))
            }
        )
    }

    const reloadSheets = () => {
        setState((state) => ({...state, loading: true}))
        spreadsheetService.loadSpreadSheets().then((sheets: SpreadSheetData[]) => {
            setState((state) => ({...state, sheets: sheets, loading: false}))
            if (sheets.length > 0 && sheets[0].id) {
                selectSpreadSheet(sheets[0].id);
            } else {
                const draft = spreadsheetService.createNew();
                spreadsheetStore.setSheet(draft);
                setState((state) => ({...state, loading: false}))
            }
        });
    }

    useLayoutEffect(() => {
        spreadsheetStore.init(spreadsheetStore.initialState)
        const sub = spreadsheetStore.subscribe(storeUpdated)

        reloadSheets();

        return () => {
            console.log('Off');
            sub.unsubscribe()
        }
    }, [])


    return (
        <div className="App">
            {state.sheets && state.sheets.length ?
                <select onChange={(e) => selectSpreadSheet(e.target.value)}>
                    {state.sheets.map(sheet => (<option value={sheet.id} key={sheet.id}>{sheet.title}</option>))}
                </select> : null
            }
            <h3>
                {state.selectedSheet && state.selectedSheet.id}
            </h3>


            <section className="App-section">
                {state.selectedSheet && <Spreadsheet width={10} height={20} sheet={state.selectedSheet}/>}
            </section>
        </div>
    );
}
