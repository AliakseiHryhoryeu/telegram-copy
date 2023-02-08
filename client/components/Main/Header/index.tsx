import React, { FC, useState } from 'react'
import { useActions } from 'src/hooks/useActions'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
import PopupIcon from '../../svg/PopupIcon'

import styles from './header.module.scss'

export const Header: FC = () => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const [searchValue, setSearchValue] = useState('')

	const allActions = useActions()

	return (
		<div className={`${styles[`header_${theme}`]} ${styles.header}`}>
			<div className={styles.header__wrapper}>
				<div
					className={styles.header__popup}
					onClick={() => allActions.toggleMainPopup()}
				>
					<PopupIcon />
				</div>
				<input
					className={styles.header__search}
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					type='text'
					placeholder='Search...'
				/>
			</div>
		</div>
	)
}

export default Header
