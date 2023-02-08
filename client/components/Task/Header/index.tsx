import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { ArrowBack } from 'src/components/svg/ArrowBack'
import { DotsIcon } from 'src/components/svg/DotsIcon'
import { useActions } from 'src/hooks/useActions'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
import PopupIcon from '../../svg/PopupIcon'

import styles from './header.module.scss'
import { Popup } from './Popup'

type PopupProps = {
	isActivePopup: boolean
}

export const Header: FC = () => {
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
					onClick={() => router.push('/')}
				>
					<ArrowBack />
				</div>
				<div
					className={`${styles.header__dots}`}
					onClick={() => setIsActvePopup(!isActivePopup)}
				>
					<DotsIcon />
				</div>
			</div>
			{isActivePopup && <Popup />}
		</div>
	)
}

export default Header
