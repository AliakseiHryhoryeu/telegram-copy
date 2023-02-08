import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { popupsActions } from 'src/store/popups/popups.slice'
import { themeActions } from 'src/store/theme/theme.slice'

const allActions = {
	...themeActions,
	...popupsActions,
}
export const useActions = () => {
	const dispach = useDispatch()

	return bindActionCreators(allActions, dispach)
}
