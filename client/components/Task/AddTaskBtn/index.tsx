import React, { FC, useState } from 'react'
import { useActions } from 'src/hooks/useActions'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
import { PlusIcon } from '../../svg/PlusIcon'

import styles from './AddTaskBtn.module.scss'

export const AddTaskBtn: FC = () => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const allActions = useActions()

	return (
		<div
			className={`${styles[`addTaskBtn_${theme}`]} ${styles.addTaskBtn}`}
			onClick={() => allActions.toggleTaskUpdatePopup()}
		>
			<PlusIcon />
		</div>
	)
}
