import classNames from 'classnames'
import { PropsWithChildren, useState } from 'react'
import { TableDataState, TableProps, TableSetttingsState, TableStateState } from './Table.types'
import { TableContext } from './Table.context'
import { TableCheckbox } from './TableCheckbox'
import { TableRow } from './TableRow'
import { TableEditor } from './TableEditor'
import { BurgerIcon } from './Icons'

/* eslint complexity: off */

export function Table(props: PropsWithChildren<TableProps>) {
	const [tableData, setTableData] = useState<TableDataState>({
		rows: props.rows,
		columns: props.columns,
		originalColumns: props.columns,
	})

	const [tableSettings, setTableSettings] = useState<TableSetttingsState>({
		name: props.name,
		rowsPerPage: props.rowsPerPage || 10,
		selectable: props.selectable || false,
		editable: props.editable || false,
		defaultSortBy: props.defaultSortBy || '',
		defaultSortOrder: props.defaultSortOrder || 'desc',
		stickyHeader: props.stickyHeader || false,
		maxHeight: props.maxHeight || 0,
		uniqueColKey: props.uniqueColKey || '',
	})

	const [tableState, setTableState] = useState<TableStateState>({
		currentPage: 1,
		sortBy: null,
		sortOrder: 'desc',
		isLoading: false,
		// searchValues: {},
		singleSelectedRow: null,
		isEditorOpen: false,
	})

	// const storageKey = () => (tableSettings.name ? `tableColumns.${tableSettings.name}` : '')
	const visibleColumns = () => tableData.columns.filter(col => !col.hidden)
	const isPaginated = () => tableSettings.rowsPerPage > 0
	const visibleRows = () => {
		const amount = tableState.currentPage * tableSettings.rowsPerPage

		return isPaginated() ? tableData.rows.slice(0, amount) : tableData.rows
	}
	const selectedRows = () => tableData.rows.filter(row => row.__selected)
	const isFullySelected = () => selectedRows().length === tableData.rows.length
	const isPartiallySelected = () => !isFullySelected() && selectedRows().length > 0
	const hasSearchableColumns = () => !!tableData.columns.find(col => col.searchType)
	const isEndReached = () =>
		tableState.currentPage * tableSettings.rowsPerPage >= tableData.rows.length

	function showMore() {
		if (isEndReached()) {
			return
		}

		setTableState(prevState => {
			const newState = { ...prevState }

			newState.currentPage += 1

			return newState
		})
	}

	function handleMainCheckboxChange(isChecked: boolean) {
		const newRows = [...tableData.rows]

		for (const item of newRows) {
			item.__selected = isChecked
		}

		setTableData({
			...tableData,
			rows: newRows,
		})
	}

	function toggleColumnEditor() {
		setTableState({ ...tableState, isEditorOpen: !tableState.isEditorOpen })
	}

	const rootClassNames = classNames({
		['app-table']: true,
		['app-table--paginated']: isPaginated(),
		['app-table--selectable']: tableSettings.selectable,
		['app-table--editable']: tableSettings.editable,
		['app-table--partially-selected']: isPartiallySelected(),
		['app-table--searchable']: hasSearchableColumns(),
		['app-table--sticky-header']: tableSettings.stickyHeader,
	})

	const LoadingSlot = props.LoadingComponent || (
		<div className="flex justify-center p-4">
			<div className="app-table-spinner">
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	)

	const EmptySlot = props.EmptyComponent || (
		<p className="bg-gray-900 p-2 text-center text-xs font-bold">No items available</p>
	)

	const EndSlot = props.EndComponent || (
		<p className="bg-gray-900 p-2 text-center font-bold">All items loaded</p>
	)

	const ShowMoreSlot = props.ShowMoreComponent?.call({}, { showMore }) || (
		<div className="bg-gray-900 p-2 text-center">
			<button onClick={showMore}>Show More</button>
		</div>
	)

	const TableSlot = (
		<div className="app-table-inner-wrap">
			<div
				className="app-table-responsive"
				style={{ maxHeight: tableSettings.maxHeight || 'none' }}
			>
				<table style={{ width: '100%' }}>
					<colgroup>
						{tableSettings.selectable && <col width="0" />}
						{visibleColumns().map(col => (
							<col key={col.key} width={col.width || 'auto'} />
						))}
						<col width="0" />
					</colgroup>
					<thead>
						<tr>
							{tableSettings.selectable && (
								<th>
									{tableSettings.selectable === 'multi' && (
										<TableCheckbox
											checked={isFullySelected()}
											partial={isPartiallySelected()}
											onChange={handleMainCheckboxChange}
										/>
									)}
								</th>
							)}
							{visibleColumns().map(col => {
								const colClassNames = classNames({
									'app-table-col': true,
									'app-table-data-col': true,
									'app-table-col--searchable': !!col.searchType,
									'app-table-col--sortable': col.sortable,
									'app-table-col--sorted': col.key === tableState.sortBy,
								})

								return (
									<th key={col.key} className={colClassNames}>
										<div className="app-table-col-label">
											<span>{col.label}</span>
											{/* <SortIcon
												v-if="col.sortable"
												order="col.key === orderBy ? orderType : null"
												class="ml-3"
											/> */}
										</div>
									</th>
								)
							})}
							<th>
								<div className="relative">
									<button
										className="flex h-4 w-6 items-center justify-center"
										title="Open column editor"
										onClick={toggleColumnEditor}
									>
										<BurgerIcon />
									</button>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{visibleRows().map((row, index) => (
							<TableRow
								row={row}
								key={index}
								even={(index + 1) % 2 === 0}
								onRadioChange={() => {
									setTableState(S => ({ ...S, singleSelectedRow: row }))

									if (props.onSelection) {
										props.onSelection([row])
									}
								}}
								onCheckboxChange={checked => {
									const newRows = [...tableData.rows]

									newRows[index].__selected = checked

									setTableData({ ...tableData, rows: newRows })
								}}
							/>
						))}
					</tbody>
				</table>
			</div>
			{isEndReached() && EndSlot}
			{isPaginated() && !isEndReached() && ShowMoreSlot}
			<TableEditor />
		</div>
	)

	return (
		<TableContext.Provider
			value={{
				tableData,
				setTableData,
				tableSettings,
				setTableSettings,
				tableState,
				setTableState,

				// computed
				visibleColumns,

				// methods
				toggleColumnEditor,
			}}
		>
			<div className={rootClassNames}>
				{props.isLoading && LoadingSlot}
				{tableData.rows.length ? TableSlot : EmptySlot}
			</div>
		</TableContext.Provider>
	)
}
