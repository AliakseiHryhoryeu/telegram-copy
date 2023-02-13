import * as Yup from 'yup'

export const passResetSchema = Yup.object({
	email: Yup.string()
		.min(4, 'Must be 4 characters at minimum')
		.max(20, 'Must be 20 characters or less')
		.email('Invalid email')
		.required('Required'),
})
