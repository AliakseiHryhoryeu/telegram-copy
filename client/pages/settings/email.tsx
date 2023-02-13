import React from 'react'
import { useFormik } from 'formik'
import Head from 'next/head'

import Header from 'src/components/Settings/Header'
import { changeEmailSchema } from 'src/components/validation/ChangeEmailValidation'
import { useChangeEmailMutation } from 'src/store/user/user.api'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from '../../styles/settings.module.scss'

const SettingsPage = () => {
	const { theme, isAuth } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
			isAuth: state.user.isAuth,
		}
	})

	const [changeEmailRequest, { isLoading: isLoading }] =
		useChangeEmailMutation()

	const formik = useFormik({
		initialValues: {
			password: '',
			newEmail: '',
		},
		validationSchema: changeEmailSchema,
		onSubmit: values => {
			changeEmailRequest({
				password: String(values.password),
				newEmail: String(values.newEmail),
			})
		},
	})

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
							<button
								type='button'
								onClick={() => {
									formik.handleSubmit()
								}}
								className={styles.settings__right}
							>
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
