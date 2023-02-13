import * as Yup from 'yup'

export const taskCreateSchema = Yup.object({
	title: Yup.string()
		.min(2, 'Must be 2 characters at minimum')
		.max(255, 'Must be 255 characters or less')
		.required('Required'),
	text: Yup.string()
		.min(2, 'Must be 2 characters at minimum')
		.max(2500, 'Must be 2500 characters or less')
		.required('Required'),
})
