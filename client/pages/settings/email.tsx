import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Header from 'src/components/Settings/Header'
import { useChangeEmailMutation } from 'src/store/user/user.api'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from '../../styles/settings.module.scss'
import { changeEmailSchema } from 'src/components/validation/ChangeEmailValidation'

const SettingsPage = () => {
	const { theme, isAuth } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
			isAuth: state.user.isAuth,
		}
	})
	const router = useRouter()

	const [changeEmailRequest, { isLoading: isLoading }] =
		useChangeEmailMutation()

	const formik = useFormik({
		initialValues: {
			newEmail: '',
		},
		validationSchema: changeEmailSchema,
		onSubmit: values => {
			changeEmailRequest({
				newEmail: values.newEmail,
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
				<title>Change email</title>
			</Head>
			<div className={`${styles[`settings_${theme}`]} ${styles.settings}`}>
				<Header route='/settings' />

				<div className={styles.settings__container}>
					<div className={styles.settings__title}>Edit Email</div>
					<form className={styles.settings__change}>
						<div className={styles.settings__change__wrapper}>
							<div className={styles.settings__subtitle}>
								Enter your new email.
							</div>

							{formik?.errors && (
								<div className={styles.settings__subtitle_error}>
									{formik?.errors.newEmail}
								</div>
							)}
							<input
								type='text'
								name='newEmail'
								placeholder='Enter your new email.'
								value={formik.values.newEmail}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<button type='submit' className={styles.settings__right}>
								Change email
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default SettingsPage
