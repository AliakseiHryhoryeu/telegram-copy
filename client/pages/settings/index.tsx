import React, { useEffect, useState } from 'react'
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
import { useRouter } from 'next/router'
import { useActions } from 'src/hooks/useActions'

const SettingsPage = () => {
	const { theme, isAuth } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
			isAuth: state.user.isAuth,
		}
	})
	const router = useRouter()
	const allActions = useActions()

	useEffect(() => {
		if (isAuth == false) {
			router.push('/login')
		}
	}, [])
	return (
		<>
			<Head>
				<title>Settings info</title>
			</Head>
			<div className={`${styles[`settings_${theme}`]} ${styles.settings}`}>
				<Header route='/' />

				<div className={styles.settings__container}>
					<div className={styles.settings__title}>Account information</div>
					<div
						className={styles.settings__wrapper}
						onClick={() => router.push('/settings/username')}
					>
						<div className={styles.settings__left}>Username</div>
						<div className={styles.settings__right}>
							<p>username</p>
							<ArrowRight />
						</div>
					</div>
					<div
						className={styles.settings__wrapper}
						onClick={() => router.push('/settings/email')}
					>
						<div className={styles.settings__left}>Email</div>
						<div className={styles.settings__right}>
							<p>test@gmail.com</p>
							<ArrowRight />
						</div>
					</div>
					<div
						className={styles.settings__wrapper}
						onClick={() => router.push('/settings/password')}
					>
						<div className={styles.settings__left}>Password</div>
						<div className={styles.settings__right}>
							{/* <p>Password</p> */}
							<ArrowRight />
						</div>
					</div>
					<div
						className={`${styles.settings__wrapper} ${styles.settings__logout}`}
						onClick={() => {
							allActions.logout()
							setTimeout(() => {
								router.push('/login')
							}, 400)
						}}
					>
						<div className={styles.settings__left}>
							<Logout /> <p>Logout</p>
						</div>
						<div className={styles.settings__right}></div>
					</div>
				</div>
			</div>
		</>
	)
}

export default SettingsPage
