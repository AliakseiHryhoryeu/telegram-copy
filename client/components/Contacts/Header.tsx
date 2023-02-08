import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { useActions } from 'src/hooks/useActions'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
import { ArrowBack } from '../svg/ArrowBack'

import styles from '../../styles/contacts.module.scss'

type HeaderProps = {
	route: string
}

export const Header: FC<HeaderProps> = ({ route }) => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const [searchValue, setSearchValue] = useState('')
	const router = useRouter()

	const allActions = useActions()

	return (
		<div className={`${styles[`header_${theme}`]} ${styles.header}`}>
			<div className={styles.header__wrapper}>
				<div
					className={styles.header__popup}
					onClick={() => router.push(route)}
				>
					<ArrowBack />
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
