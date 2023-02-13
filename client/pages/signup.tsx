import React, { FC, useEffect } from 'react'
import { useFormik } from 'formik'

// import { UserActions } from 'app/store/actions'
// import { RootState } from 'app/store/reducers'
import { signUpSchema } from '../components/validation/SignupValidation'

import styles from '../styles/signup.module.scss'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { RootState } from '../store'
import { useRouter } from 'next/router'
import { useSignupMutation } from '../store/user/user.api'
import Head from 'next/head'
// import { FacebookIcon } from 'src/components/svg/FacebookIcon'
// import { GoogleIcon } from 'src/components/svg/GoogleIcon'
// import { WarningIcon } from 'src/components/svg/WarningIcon'

const SignUpPage: FC = () => {
	const [loginRequest, { isLoading: isLoading }] = useSignupMutation()
	const { isAuth } = useTypedSelector((state: RootState) => {
		return {
			isAuth: state.user.isAuth,
		}
	})
	const router = useRouter()

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			confirmPassword: '',
			username: '',
			emailSpam: true,
			rights: true,
		},
		validationSchema: signUpSchema,
		onSubmit: values => {
			loginRequest({
				email: values.email,
				username: values.username,
				password: values.password,
			})
		},
	})

	useEffect(() => {
		if (isAuth === true) {
			router.push('/')
		}
	}, [])
	return (
		<>
			<Head>
				<title>Good Deeds - Sign up</title>
			</Head>
			<div className={styles.signup}>
				<div className={styles.signup__header}>
					<a href='/'>Good deeds</a>
				</div>
				<div className={styles.signup__title}>Sign up page.</div>
				<div className={styles.signup__wrapper}>
					{/* <div className={styles.signup__social}>
					<div
						className={`${styles.signup__social_btn} ${styles.signup__social_facebook}`}
					>
						<FacebookIcon /> Continue with facebook
					</div>
					<div
						className={`${styles.signup__social_btn} ${styles.signup__social_google}`}
					>
						<GoogleIcon />
						Continue with google
					</div>
				</div>
				<div className={styles.signup__divider}>
					<span>or</span>
				</div> */}
					<form
						className={styles.signup__form}
						onSubmit={formik.handleSubmit}
						noValidate
					>
						<div className={styles.signup__form__main_title}>
							Sign up with your email address
						</div>
						<div className={styles.signup__form_wrapper}>
							<div className={styles.signup__form_title}>
								What's your email?
							</div>
							{formik?.errors && (
								<div className={styles.signup__form_title_error}>
									{formik?.errors.email}
								</div>
							)}
							<input
								className={styles.signup__form_input}
								placeholder='Enter your email.'
								name='email'
								type='text'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.email}
							/>
						</div>
						<div className={styles.signup__form_wrapper}>
							<div className={styles.signup__form_title}>Create a password</div>
							{formik?.errors && (
								<div className={styles.signup__form_title_error}>
									{formik?.errors.password}
								</div>
							)}
							<input
								className={styles.signup__form_input}
								placeholder='Create a password.'
								name='password'
								type='password'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.password}
							/>
						</div>
						{/* <div className={styles.signup__form_wrapper}>
						<div className={styles.signup__form_title}>
							Confirm your password
						</div>
						<input
							className={styles.signup__form_input}
							placeholder='Enter your password again.'
							name='confirmPassword'
							type='password'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirmPassword}
						/>
					</div> */}
						<div className={styles.signup__form_wrapper}>
							<div className={styles.signup__form_title}>
								What should we call you?
							</div>
							{formik?.errors && (
								<div className={styles.signup__form_title_error}>
									{formik?.errors.username}
								</div>
							)}
							<input
								className={styles.signup__form_input}
								placeholder='Enter a profile name.'
								name='username'
								type='text'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.username}
							/>
						</div>
						<div
							className={styles.signup__form_checkbox}
							onClick={() => {
								formik.setFieldValue('emailSpam', !formik.values.emailSpam)
							}}
						>
							<input
								className={styles.signup__form_check}
								name='emailSpam'
								type='checkbox'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								checked={formik.values.emailSpam}
							/>
							<div className={styles.signup__form_title}>
								I would prefer not to receive marketing messages from GOOD DEEDS
							</div>
						</div>
						<div className={styles.signup__form_checkbox}>
							<input
								className={styles.signup__form_check}
								name='rights'
								type='checkbox'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								checked={formik.values.rights}
								onClick={() => {
									formik.setFieldValue('rights', !formik.values.rights)
									console.log(formik.values.rights)
								}}
							/>
							<div className={styles.signup__form_title}>
								I agree to the
								<span>GOOD DEEDS Terms and Conditions of Use</span>
								and<span>Privacy Policy.</span>
							</div>
						</div>
						{/* <div className={styles.signup__form_warning}>
						<WarningIcon />
						<div className={styles.signup__form_title}>
							Please accept the terms and conditions to continue.
						</div>
					</div> */}
						<button
							type='button'
							onClick={() => {
								formik.handleSubmit()
							}}
							className={styles.signup__form_button_signup}
						>
							Sign up
						</button>
						<div className={styles.signup__button_login}>
							Have an account?
							<a href='/login'>Log in</a>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default SignUpPage
