import React, { FC } from 'react'
// import { useActions } from 'src/hooks/useActions'
// import { useTypedSelector } from 'src/hooks/useTypedSelector'
// import { RootState } from 'src/store'
import { PlusIcon } from '../../svg/PlusIcon'

import styles from './mainPopup.module.scss'

export const AccountsMenu: FC = () => {
	return (
		<div className={styles.mainPopup__accounts}>
			<div className={styles.mainPopup__accounts_wrapper}>
				<div className={styles.mainPopup__accounts_photo}></div>
				<div className={styles.mainPopup__accounts_username}>Username</div>
			</div>
			<div className={styles.mainPopup__accounts_wrapper}>
				<div className={styles.mainPopup__accounts_photo}></div>
				<div className={styles.mainPopup__accounts_username}>Username</div>
			</div>
			<div
				className={`${styles.mainPopup__accounts_wrapper} ${styles.mainPopup__accounts_add}`}
			>
				{/* Need change svg icon to normal, becouse this icon dont fill all svg viewBox */}
				<PlusIcon />
				<p>Add account</p>
			</div>
		</div>
	)
}
