import * as Yup from 'yup'

export const changeEmailSchema = Yup.object({
	newEmail: Yup.string()
		.min(4, 'Must be 2 characters at minimum')
		.max(20, 'Must be 20 characters or less')
		.required('Required')
		.email('Invalid email'),
})
