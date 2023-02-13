import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'

import Header from 'src/components/Settings/Header'
import { changeUsernameSchema } from 'src/components/validation/ChangeUsernameValidation'
import { useChangeUsernameMutation } from 'src/store/user/user.api'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from 'src/styles/settings.module.scss'

const SettingsPage = () => {
	const { theme, isAuth } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
			isAuth: state.user.isAuth,
		}
	})
	const router = useRouter()
	const [changeUsernameRequest, { isLoading: isLoading }] =
		useChangeUsernameMutation()

	const formik = useFormik({
		initialValues: {
			password: '',
			newUsername: '',
		},
		validationSchema: changeUsernameSchema,
		onSubmit: values => {
			changeUsernameRequest({
				password: values.password,
				newUsername: values.newUsername,
			})
		},
	})

	useEffect(() => {
		if (isAuth === false) {
			router.push('/login')
		}
	}, [])
	return (
		<>
			<Head>
				<title>Change username</title>
			</Head>
			<div className={`${styles[`settings_${theme}`]} ${styles.settings}`}>
				<Header route='/settings' />

				<div className={styles.settings__container}>
					<div className={styles.settings__title}>Edit Username</div>

					<form className={styles.settings__change}>
						<div className={styles.settings__change__wrapper}>
							<div className={styles.settings__subtitle}>
								Enter your current password
							</div>
							{formik?.errors && (
								<div className={styles.settings__subtitle_error}>
									{formik?.errors.password}
								</div>
							)}
							<input
								type='text'
								name='password'
								placeholder='Enter your current password.'
								value={formik.values.password}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>

							<div className={styles.settings__subtitle}>
								Enter your new username.
							</div>
							{formik?.errors && (
								<div className={styles.settings__subtitle_error}>
									{formik?.errors.newUsername}
								</div>
							)}
							<input
								type='text'
								name='newUsername'
								placeholder='Repeat your new password.'
								value={formik.values.newUsername}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<button
								type='button'
								onClick={() => {
									formik.handleSubmit()
								}}
								className={styles.settings__right}
							>
								Change username
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default SettingsPage
