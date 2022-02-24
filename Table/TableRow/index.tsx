import { useContext, useState } from 'react'
import { TableCheckbox } from '../TableCheckbox'
import { TableRadio } from '../TableRadio'
import { TableContext } from '../Table.context'
import { TableRowProps } from './TableRow.types'

export function TableRow(props: TableRowProps) {
	const [isHover, setIsHover] = useState(false)
	const { tableSettings, tableState, visibleColumns } = useContext(TableContext)

	function renderInput() {
		if (tableSettings.selectable === 'single') {
			return (
				<td>
					<TableRadio
						obey={tableState.singleSelectedRow?.[tableSettings.uniqueColKey]}
						value={props.row[tableSettings.uniqueColKey]}
						onChange={props.onRadioChange}
					/>
				</td>
			)
		} else if (tableSettings.selectable === 'multi') {
			return (
				<td>
					<TableCheckbox
						checked={props.row.__selected}
						onChange={props.onCheckboxChange}
					/>
				</td>
			)
		}
	}

	return (
		<>
			<tr onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
				{renderInput()}
				{visibleColumns().map(column => (
					<td key={column.key}>
						<span>{props.row[column.key]}</span>
					</td>
				))}
				<td></td>
			</tr>
		</>
	)
}
