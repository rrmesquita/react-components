import { TableRow } from '../Table.types'

export interface TableRowProps {
	row: TableRow
	even: boolean
	onRadioChange: (checked: boolean) => void
	onCheckboxChange: (checked: boolean) => void
}
