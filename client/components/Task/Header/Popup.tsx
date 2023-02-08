import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'

import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from './header.module.scss'
import { PensilIcon } from 'src/components/svg/PensilIcon'
import { GarbageIcon } from 'src/components/svg/GarbageIcon'

export const Popup: FC = () => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const router = useRouter()

	return (
		<div
			className={`${styles[`header__popup_${theme}`]} ${styles.header__popup}`}
		>
			<div className={styles.header__popup__container}>
				<div className={styles.header__popup__wrapper}>
					<PensilIcon />
					<p>Edit task</p>
				</div>
				<div className={styles.header__popup__wrapper}>
					<GarbageIcon />
					<p>Delete task</p>
				</div>
			</div>
		</div>
	)
}
