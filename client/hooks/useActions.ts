import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { popupsActions } from 'src/store/popups/popups.slice'
import { themeActions } from 'src/store/theme/theme.slice'
import { userActions } from 'src/store/user/user.slice'

const allActions = {
	...themeActions,
	...popupsActions,
	...userActions,
}
export const useActions = () => {
	const dispach = useDispatch()

	return bindActionCreators(allActions, dispach)
}
