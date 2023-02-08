import React, { FC, useState } from 'react'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from './TaskUpdate.module.scss'

export const Friends: FC = () => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})

	const [title, updateTitle] = useState('')
	const [description, updateDescription] = useState('')

	return (
		<>
			<div className='header'></div>
			<div className={`${styles[`taskUpdate_${theme}`]} ${styles.taskUpdate}`}>
				<div className={styles.taskUpdate__wrapper}>
					<div className='settings__title'>Account information</div>
					<div className='settings__info_wrapper'>
						<div className='settings__info_title'>Username</div>
						<div className=''>
							<div className='settings__info_data'>username</div>
							<div className='sagasg'>img</div>
						</div>
					</div>
					<div className='settings__info_wrapper'>
						<div className='settings__info_title'>email</div>
						<div className=''>
							<div className='settings__info_data'>test@gmail.com</div>
							<div className='sagasg'>img</div>
						</div>
					</div>
					<div className='settings__info_wrapper'>
						<div className='settings__info_title'>password</div>
						<div className=''>
							<div className='settings__info_data'></div>
							<div className='sagasg'>img</div>
						</div>
					</div>
					<div className='settings__logout'>
						img
						<p>logout</p>
					</div>
				</div>
			</div>
			<div className={styles.taskUpdate__bg}></div>
		</>
	)
}
