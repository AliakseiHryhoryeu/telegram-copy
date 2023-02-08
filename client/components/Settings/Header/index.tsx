import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { ArrowBack } from 'src/components/svg/ArrowBack'
import { useActions } from 'src/hooks/useActions'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from './header.module.scss'

type HeaderProps = {
	route: string
}

export const Header: FC<HeaderProps> = ({ route }) => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const [isActivePopup, setIsActvePopup] = useState(false)
	const router = useRouter()
	const allActions = useActions()

	return (
		<div className={`${styles[`header_${theme}`]} ${styles.header}`}>
			<div className={styles.header__wrapper}>
				<div
					className={styles.header__popupBtn}
					onClick={() => router.push(route)}
				>
					<ArrowBack />
				</div>
				<div className={`${styles.header__username}`}>Username</div>
			</div>
		</div>
	)
}

export default Header
