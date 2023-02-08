import React, { FC, useState } from 'react'
import { useActions } from 'src/hooks/useActions'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
// import PopupIcon from '../MainPage/img/PopupIcon'

import styles from './TaskUpdate.module.scss'

export const TaskUpdate: FC = () => {
	const { theme, isActivePopup } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
			isActivePopup: state.popups.taskUpdate,
		}
	})
	const allActions = useActions()
	const [title, updateTitle] = useState('')
	const [description, updateDescription] = useState('')

	return (
		<div className={`${styles[`taskUpdate__display_${isActivePopup}`]}`}>
			<div className={`${styles[`taskUpdate_${theme}`]} ${styles.taskUpdate}`}>
				<div className={styles.taskUpdate__wrapper}>
					<input
						className={`${styles.taskUpdate__input} ${styles.taskUpdate__title}`}
						value={title}
						type='text'
						onChange={e => updateTitle(e.currentTarget.value)}
					/>
					<textarea
						className={`${styles.taskUpdate__input} ${styles.taskUpdate__input__text}`}
						value={description}
						onChange={e => updateDescription(e.currentTarget.value)}
					/>
					<div className={styles.taskUpdate__buttons}>
						<div>Cancel</div>
						<div>Add</div>
					</div>
				</div>
			</div>
			<div
				className={styles.taskUpdate__bg}
				onClick={e => allActions.toggleTaskUpdatePopup()}
			></div>
		</div>
	)
}
