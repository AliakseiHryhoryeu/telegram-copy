import React, { FC } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
// import { UserActions } from 'app/store/actions'

// import { RootState } from 'app/store/reducers'
import { PassResetSchema } from '../components/Auth/PassResetValidation'

// import facebookIcon from 'assets/img/facebook-icon-signup.svg'
// import googleIcon from 'assets/img/google-icon-signup.svg'

import styles from '../styles/passreset.module.scss'
import Link from 'next/link'

const PassResetPage: FC = () => {
	// const dispatch = useDispatch()
	// const navigate = useNavigate()
	// const { isAuth } = useSelector((state: RootState) => {
	// 	return {
	// 		isAuth: state.user.isAuth,
	// 	}
	// })
	// if (isAuth === true) {
	// 	navigate('/main', { replace: true })
	// }

	const formik = useFormik({
		initialValues: {
			usernameOrEmail: '',
			password: '',
			remember: '',
		},
		validationSchema: PassResetSchema,
		onSubmit: values => {
			// dispatch(UserActions.PassReset(values.username, values.password))
			// UserActions.PassReset(values.usernameOrEmail, values.password)
			// navigate('/main', { replace: true })
		},
	})
	return (
		<div className={styles.PassReset}>
			<div className={styles.PassReset__header}>
				<a href='/'>good deeds</a>
			</div>
			<div className={styles.PassReset__title}>Password Reset</div>
			<div className={styles.PassReset__subtitle}>
				Enter your <b>GOOD DEEDS username</b> or the <b> email address</b> that
				you used to register. We'll send you an email with your username and a
				link to reset your password.
			</div>
			<div className={styles.PassReset__wrapper}>
				<form
					className={styles.PassReset__form}
					onSubmit={formik.handleSubmit}
					noValidate
				>
					<div className={styles.PassReset__form_wrapper}>
						<div className={styles.PassReset__form_title}>
							Email address or username
						</div>
						<input
							className={styles.PassReset__form_input}
							placeholder='Email address or username.'
							name='text'
							type='text'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.usernameOrEmail}
						/>
					</div>
					<button
						type='submit'
						className={styles.PassReset__form_button_PassReset}
					>
						Send
					</button>
					<div className={styles.PassReset__help__title}>
						If you still need help, contact
						<a href='/support'>GOOD DEEDS Support</a>.
					</div>
				</form>
			</div>
		</div>
	)
}

export default PassResetPage
