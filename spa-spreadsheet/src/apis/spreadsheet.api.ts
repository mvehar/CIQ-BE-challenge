import axios from "axios";
import {SpreadSheetData} from "../models/SpreadSheetData";
import {PATH} from "./paths";

const API = 'http://localhost:5000/';

export function getSpreadsheets() {
    return axios.get(API + PATH.LIST_SPREADSHEETS)
        .then((response): SpreadSheetData[] => {
            if (response.status === 200) {
                return response.data
            }
            throw new Error('List failed')
        })
}

export function getSpreadsheet(id: string): Promise<SpreadSheetData> {
    return axios.get(API + PATH.CRUD_SPREADSHEET + id)
        .then((response): SpreadSheetData => {
            if (response.status === 200) {
                return response.data
            }
            throw new Error('Get failed')
        })
}


export function newSpreadsheet(data: SpreadSheetData) {
    return axios.post(API + PATH.LIST_SPREADSHEETS, data)
        .then((response): SpreadSheetData => {
            if (response.status === 200) {
                return response.data
            }
            throw new Error('Create failed')
        })
}


export function updateSpreadsheet(id: string, data: SpreadSheetData) {
    return axios.patch(API + PATH.CRUD_SPREADSHEET + id, data)
        .then((response): SpreadSheetData => {
            if (response.status === 200) {
                return response.data
            }
            throw new Error('Update failed')
        })
}


export function deleteSpreadsheet(id: string) {
    return axios.delete(API + PATH.CRUD_SPREADSHEET + id)
        .then((response): boolean => {
            return response.status === 200;
        })
}