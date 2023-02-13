import React, { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useFormik } from 'formik'

import { loginSchema } from '../components/validation/LoginValidation'
// import { FacebookIcon } from 'src/components/svg/FacebookIcon'
// import { GoogleIcon } from 'src/components/svg/GoogleIcon'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { useLoginMutation } from 'src/store/user/user.api'
import { RootState } from 'src/store'

import styles from '../styles/login.module.scss'

const LoginPage: FC = () => {
	const router = useRouter()
	const [loginRequest, { isLoading: isLoading }] = useLoginMutation()

	const { isAuth } = useTypedSelector((state: RootState) => {
		return {
			isAuth: state.user.isAuth,
		}
	})

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			remember: true,
		},
		validationSchema: loginSchema,
		onSubmit: values => {
			loginRequest({
				email: values.email,
				password: values.password,
			})
		},
	})
	// if (isAuth === true) {
	// 	router.push('/')
	// }
	useEffect(() => {
		if (isAuth == true) {
			router.push('/')
		}
	}, [isAuth])
	return (
		<>
			<Head>
				<title>Good Deeds - Login page</title>
			</Head>
			<div className={styles.login}>
				<div className={styles.login__header}>
					<a href='/'>good deeds</a>
				</div>
				<div className={styles.login__title}>Login page.</div>
				<div className={styles.login__wrapper}>
					{/* <div className={styles.login__social}>
					<div
						className={`${styles.login__social_btn} ${styles.login__social_facebook}`}
					>
						<FacebookIcon />
						Continue with facebook
					</div>
					<div
						className={`${styles.login__social_btn} ${styles.login__social_google}`}
					>
						<GoogleIcon />
						Continue with google
					</div>
				</div>
				<div className={styles.login__divider}>
					<span>or</span>
				</div> */}
					<form
						className={styles.login__form}
						onSubmit={formik.handleSubmit}
						noValidate
					>
						<div className={styles.login__form__main_title}>
							Sign up with your email address
						</div>
						<div className={styles.login__form_wrapper}>
							<div className={styles.login__form_title}>Email address</div>
							{formik?.errors && (
								<div className={styles.login__form_title_error}>
									{formik?.errors.email}
								</div>
							)}
							<input
								className={styles.login__form_input}
								placeholder='Email address.'
								name='email'
								type='text'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.email}
							/>
						</div>
						<div className={styles.login__form_wrapper}>
							<div className={styles.login__form_title}>Password</div>
							{formik?.errors && (
								<div className={styles.login__form_title_error}>
									{formik?.errors.password}
								</div>
							)}
							<input
								className={styles.login__form_input}
								placeholder='Password.'
								name='password'
								type='password'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.password}
							/>
							<div className={styles.login__form_subtitle}>
								<a href='/passreset'>Forgot your password?</a>
							</div>
						</div>
						<div className={styles.login__auth}>
							<div className={styles.login__form_checkbox}>
								<input
									className={styles.login__form_check}
									name='remember'
									type='checkbox'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									checked={formik.values.remember}
								/>
								<div className={styles.login__form_title}>Remember me</div>
							</div>
							<button
								type='button'
								onClick={() => {
									formik.handleSubmit()
								}}
								className={styles.login__form_button_login}
							>
								log in
							</button>
						</div>
						<a className={styles.login__donthave__title} href='/signup'>
							Don’t have an account?
						</a>

						<a className={styles.login__donthave__button} href='/signup'>
							Sign up
						</a>
					</form>
				</div>
			</div>
		</>
	)
}

export default LoginPage
