import classNames from 'classnames'
import React from 'react'
import { TableCheckboxProps } from './TableCheckbox.types'

export function TableCheckbox(props: TableCheckboxProps) {
	function renderIcon() {
		switch (true) {
			case props.checked:
				return (
					<svg
						className="text-white"
						width="11"
						height="8"
						viewBox="0 0 11 8"
						fill="none"
					>
						<path d="M1 3L4 7L10 1" stroke="currentColor" strokeWidth="1.3" />
					</svg>
				)

			case props.partial:
				return (
					<svg
						className="text-gray-700"
						width="8"
						height="2"
						viewBox="0 0 8 2"
						fill="none"
					>
						<rect width="8" height="2" fill="currentColor" />
					</svg>
				)
		}
	}

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation()
		props.onChange(!props.checked)
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		const firingCodes = [
			13, // enter
			32, // space
		]

		if (firingCodes.includes(e.keyCode)) {
			props.onChange(!props.checked)
		}
	}

	return (
		<div
			className={classNames([
				'app-table-checkbox',
				{ 'app-table-checkbox--active': props.checked },
			])}
			tabIndex={0}
			role="checkbox"
			aria-checked={props.checked}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{renderIcon()}
		</div>
	)
}
