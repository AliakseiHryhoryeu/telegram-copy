import React, { FC, useState } from 'react'
import { useActions } from 'src/hooks/useActions'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
import { PlusIcon } from '../../svg/PlusIcon'
import PopupIcon from '../../svg/PopupIcon'

import { ArrowDown } from 'src/components/svg/ArrowDown'
import { ArrowUp } from 'src/components/svg/ArrowUp'

import styles from './mainPopup.module.scss'
import { SettingsIcon } from 'src/components/svg/SettingsIcon'
import { FriendsIcon } from 'src/components/svg/FriendsIcon'
import { MoonIcon } from 'src/components/svg/MoonIcon'
import { AccountsMenu } from './AccountsMenu'
import { ToggleTheme } from 'src/components/ToggleTheme'
import { Router, useRouter } from 'next/router'

export const MainPopup: FC = () => {
	const { theme, isActivePopup } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
			isActivePopup: state.popups.main,
		}
	})
	const router = useRouter()
	const allActions = useActions()
	const [accountsMenu, updateAccountsMenu] = useState(false)

	const [title, updateTitle] = useState('')
	const [description, updateDescription] = useState('')

	return (
		<div className={`${styles[`mainPopup__display_${isActivePopup}`]}`}>
			<div
				className={`
				${styles[`mainPopup__${theme}`]} 
				${styles.mainPopup} 
				`}
			>
				<div className={styles.mainPopup__wrapper}>
					<div className={styles.mainPopup__userinfo}>
						<div className={styles.mainPopup__userinfo_photo}></div>
						<div
							className={styles.mainPopup__userinfo_wrapper}
							onClick={() => updateAccountsMenu(!accountsMenu)}
						>
							<div className={styles.mainPopup__userinfo_username}>
								Username
							</div>
							{accountsMenu && <ArrowDown />}
							{!accountsMenu && <ArrowUp />}
						</div>
					</div>
					{accountsMenu && <AccountsMenu />}
					<div className={styles.mainPopup__buttons}>
						<div
							className={styles.mainPopup__buttons_wrapper}
							onClick={() => {
								allActions.toggleMainPopup()
								router.push('/contacts')
							}}
						>
							<FriendsIcon />
							<div className={styles.mainPopup__buttons_title}>Contacts</div>
						</div>
						<div
							className={styles.mainPopup__buttons_wrapper}
							onClick={() => {
								allActions.toggleMainPopup()
								router.push('/settings')
							}}
						>
							<SettingsIcon />
							<div className={styles.mainPopup__buttons_title}>Settings</div>
						</div>
						<div
							className={`${styles.mainPopup__buttons_wrapper} ${styles.mainPopup__buttons_themes}`}
						>
							<ToggleTheme />
						</div>
					</div>
				</div>
			</div>
			<div
				className={styles.mainPopup__bg}
				onClick={e => allActions.toggleMainPopup()}
			></div>
		</div>
	)
}
