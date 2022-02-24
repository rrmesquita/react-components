import { createContext, Dispatch, SetStateAction } from 'react'
import { TableColumn, TableDataState, TableSetttingsState, TableStateState } from './Table.types'

interface TableContextProps {
	tableData: TableDataState
	setTableData: Dispatch<SetStateAction<TableDataState>>
	tableSettings: TableSetttingsState
	setTableSettings: Dispatch<SetStateAction<TableSetttingsState>>
	tableState: TableStateState
	setTableState: Dispatch<SetStateAction<TableStateState>>

	// computed
	visibleColumns: () => TableColumn[]

	// methods
	toggleColumnEditor: () => void
}

export const TableContext = createContext<TableContextProps>({} as TableContextProps)
