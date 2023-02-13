import React from 'react'
import { useFormik } from 'formik'
import Head from 'next/head'

import Header from 'src/components/Settings/Header'
import { changePasswordSchema } from 'src/components/validation/ChangePassValidation'
import { useChangePasswordMutation } from 'src/store/user/user.api'
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

	const [changePasswordRequest, { isLoading: isLoading }] =
		useChangePasswordMutation()

	const formik = useFormik({
		initialValues: {
			currentPassword: '',
			newPassword: '',
			repeatNewPassword: '',
		},
		validationSchema: changePasswordSchema,
		onSubmit: values => {
			changePasswordRequest({
				password: values.currentPassword,
				newPassword: values.newPassword,
			})
		},
	})

	return (
		<>
			<Head>
				<title>Change password</title>
			</Head>
			<div className={`${styles[`settings_${theme}`]} ${styles.settings}`}>
				<Header route='/settings' />

				<div className={styles.settings__container}>
					<div className={styles.settings__title}>Edit Password</div>
					<form className={styles.settings__change}>
						<div className={styles.settings__change__wrapper}>
							<div className={styles.settings__subtitle}>Current password.</div>
							{formik?.errors && (
								<div className={styles.settings__subtitle_error}>
									{formik?.errors.currentPassword}
								</div>
							)}
							<input
								type='text'
								name='currentPassword'
								placeholder='Current password.'
								value={formik.values.currentPassword}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<div className={styles.settings__subtitle}>New password.</div>
							{formik?.errors && (
								<div className={styles.settings__subtitle_error}>
									{formik?.errors.newPassword}
								</div>
							)}
							<input
								type='password'
								name='newPassword'
								placeholder='New password.'
								value={formik.values.newPassword}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<div className={styles.settings__subtitle}>
								Repeat your new password.
							</div>
							{formik?.errors && (
								<div className={styles.settings__subtitle_error}>
									{formik?.errors.repeatNewPassword}
								</div>
							)}
							<input
								type='password'
								name='repeatNewPassword'
								placeholder='Repeat your new password.'
								value={formik.values.repeatNewPassword}
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
								Change password
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default SettingsPage
