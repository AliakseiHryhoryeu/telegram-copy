import React, { FC } from 'react'
// import classNames from 'classnames'

import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { useActions } from 'src/hooks/useActions'
import { RootState } from 'src/store'

import { MoonIcon } from '../svg/MoonIcon'

import styles from './toggleTheme.module.scss'

export const ToggleTheme: FC = () => {
	const allActions = useActions()
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})

	return (
		// className={classNames('toggleTheme', `toggleTheme-${theme}`)}
		<label
			className={`${styles.toggleTheme} ${styles[`toggleTheme_${theme}`]}`}
		>
			<div className={styles.toggleTheme__left}>
				<MoonIcon />
				<div className={styles.mainPopup__buttons_title}>Night Mode</div>
			</div>

			<input
				id='toggleThemeCheckbox'
				type='checkbox'
				checked={theme === 'light' || false}
				onChange={() => allActions.toggleTheme()}
				className={styles.toggleTheme_checkbox}
			/>
			<span className={styles.toggleTheme_span}></span>
		</label>
	)
}
