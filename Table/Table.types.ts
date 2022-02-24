type SortOrder = 'asc' | 'desc'

export interface TableColumn {
	label: string
	key: string
	hidden?: boolean
	sortable?: boolean
	searchType?: 'text' | 'select'
	searchOptions?: {
		value: string
		label: string
	}[]
	width?: string
}

export interface TableRow {
	[key: string]: any
	__selected?: boolean
	__expanded?: boolean
}

export interface TableDataState {
	rows: TableRow[]
	columns: TableColumn[]
	originalColumns: TableColumn[]
}

export interface TableSetttingsState {
	name: string
	rowsPerPage: number
	selectable: 'single' | 'multi' | false
	editable: boolean
	defaultSortBy: string | null
	defaultSortOrder: SortOrder
	stickyHeader: boolean
	maxHeight: number

	/**
	 * The column `key` that has a different value in each row.
	 * Required if `selectable` is equal to `single`
	 */
	uniqueColKey: string | null
}

export interface TableStateState {
	currentPage: number
	sortBy: string | null
	sortOrder: SortOrder
	isLoading: boolean
	// searchValues: {},
	singleSelectedRow: TableRow | null
	isEditorOpen: boolean
}

export type TableSetupConfig = Omit<TableDataState, 'originalColumns'> &
	Partial<TableSetttingsState> & { key: string }

export interface TableProps extends TableSetupConfig {
	classPrefix?: string
	isLoading?: boolean
	LoadingComponent?: JSX.Element
	EmptyComponent?: JSX.Element
	EndComponent?: JSX.Element
	ShowMoreComponent?: (props: { showMore: () => void }) => JSX.Element
	onSelection?: (selected: TableRow[]) => void
}
