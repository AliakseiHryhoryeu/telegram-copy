import * as Yup from 'yup'

export const changePasswordSchema = Yup.object({
	currentPassword: Yup.string()
		.min(6, 'Must be 6 characters at minimum')
		.max(20, 'Must be 20 characters or less')
		.required('Required'),
	newPassword: Yup.string()
		.min(6, 'Must be 6 characters at minimum')
		.max(20, 'Must be 20 characters or less')
		.required('Required'),
	repeatNewPassword: Yup.string()
		.min(6, 'Must be 6 characters at minimum')
		.max(20, 'Must be 20 characters or less')
		.required('Required')
		.oneOf([Yup.ref('newPassword'), ''], 'Passwords must match'),
})
