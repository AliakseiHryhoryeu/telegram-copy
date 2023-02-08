import React, { useState } from 'react'
import Head from 'next/head'
// import Link from 'next/link'
// import { Projects } from 'src/components'
import styles from '../../styles/settings.module.scss'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
import Header from 'src/components/Settings/Header'
import { MessageBtnIcon } from 'src/components/svg/MessageBtnIcon'
import { ArrowRight } from 'src/components/svg/ArrowRight'
import { Logout } from 'src/components/svg/Logout'

const SettingsPage = () => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const [messageInput, updateMessageInput] = useState('')

	return (
		<>
			<Head>
				<title>Settings info</title>
			</Head>
			<div className={`${styles[`settings_${theme}`]} ${styles.settings}`}>
				<Header route='/settings' />

				<div className={styles.settings__container}>
					<div className={styles.settings__title}>Edit Username</div>
					<div className={styles.settings__subtitle}>
						Current Username :{``}
					</div>

					<form className={styles.settings__change__wrapper}>
						<input
							value={messageInput}
							onChange={e => {
								updateMessageInput(e.target.value)
							}}
							type='text'
						/>
						<button type='submit' className={styles.settings__right}>
							Change username
						</button>
					</form>
				</div>
			</div>
		</>
	)
}

export default SettingsPage
