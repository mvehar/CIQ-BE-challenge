import React, {useEffect, useMemo, useState} from 'react';
import {CellDisplay} from "../../models/CellDisplay";
import './EditCell.css'

const classNames = require('classnames');

interface IProps {
    updateCell: (value: string) => void;
    cell: CellDisplay | null,
}

interface IState {
    edit: boolean;
}

export default function EditCell(props: IProps) {
    const [state, setState] = useState<IState>({edit: false})
    const [inputValue, setInputValue] = useState<string>('')

    const toggleEdit = (edit: boolean) => {
        const value = props.cell ? String(props.cell.value) : '';
        console.log(value);
        setInputValue(value)
    }

    const updateCellValue = (event: React.FocusEvent<HTMLInputElement>) => {
        const element: HTMLInputElement = event.target as HTMLInputElement;
        if (!element.reportValidity()) {
            return;
        }

        const value = element.value;

        setState((state) => ({...state, edit: false}))
        props.updateCell(value);
    }

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue)
    }

    const checkIfEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;
            target.blur();
        }
    }

    useEffect(() => {
        const {cell} = props;
        let defaultValue = cell ? String(cell.display) : '';
        if (cell && !state.edit) {
            if (cell.hasError) {
                defaultValue = 'ERROR: ' + cell.value;
            }
        }

        setInputValue(defaultValue)
    }, [props])


    const {cell} = props;
    const classes = useMemo(() => classNames('EditCell', {
        'has-formula': cell && cell.hasFormula,
        'is-edit': state.edit,
        'has-error': cell && cell.hasError,
    }), [state, cell])

    return (
        <>
            <input type="text"
                   className={classes}
                   pattern="=?([A-Z0-9\+])+"
                   onFocus={() => toggleEdit(true)}
                   onBlur={updateCellValue}
                   value={inputValue}
                   onChange={inputChange}
                   onKeyDown={checkIfEnter}
            />
        </>
    )
}
