import classNames from 'classnames'
import { TableRadioProps } from './TableRadio.types'

export function TableRadio(props: TableRadioProps) {
	const isChecked = () => props.value === props.obey

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation()
		props.onChange(isChecked())
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		const firingCodes = [
			13, // enter
			32, // space
		]

		if (firingCodes.includes(e.keyCode)) {
			props.onChange(isChecked())
		}
	}

	return (
		<div
			className={classNames({
				'app-table-radio': true,
				'app-table-radio--checked': isChecked(),
			})}
			tabIndex={0}
			role="radio"
			aria-checked={isChecked()}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		/>
	)
}
