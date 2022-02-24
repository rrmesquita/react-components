import { useContext } from 'react'
import { BurgerIcon } from '../Icons'
import { TableCheckbox } from '../TableCheckbox'
import { TableContext } from '../Table.context'
import { TableColumn } from '../Table.types'

export function TableEditor() {
	const { tableData, setTableData, tableState, visibleColumns, toggleColumnEditor } =
		useContext(TableContext)

	function toggleColumn(column: TableColumn) {
		if (!column.hidden && visibleColumns().length < 2) {
			alert('You must leave at least one column visible')

			return
		}

		const newColumns = [...tableData.columns]
		const target = newColumns.find(c => c.key === column.key)

		target.hidden = !target.hidden

		setTableData({ ...tableData, columns: newColumns })
	}

	return (
		<>
			{tableState.isEditorOpen && (
				<div
					className="absolute z-10 rounded border border-gray-700 bg-gray-800"
					style={{ top: '-10px', right: '-2px' }}
				>
					<button
						className="flex w-full cursor-pointer items-center justify-between p-4"
						title="Close column editor"
						onClick={toggleColumnEditor}
					>
						<span className="mr-2 font-bold">Edit/Order columns</span>
						<BurgerIcon />
					</button>
					{tableData.columns.map(col => (
						<div key={col.key} className="flex items-center space-x-2 px-4 font-normal">
							<BurgerIcon className="text-gray-700" />
							<TableCheckbox
								checked={!col.hidden}
								onChange={() => toggleColumn(col)}
							/>
							<span
								className={col.hidden ? 'text-gray-500' : 'text-gray-300'}
								onClick={() => toggleColumn(col)}
							>
								{col.label}
							</span>
						</div>
					))}
				</div>
			)}
		</>
	)
}
