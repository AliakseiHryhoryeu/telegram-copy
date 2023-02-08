export const Meta = () => {
	return (
		<>
			<meta charSet='UTF-8' key='charset' />
			{/* Need Update fonts when i start SCSS */}
			<link
				rel='stylesheet'
				href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
			/>
			<link
				rel='stylesheet'
				href='https://fonts.googleapis.com/icon?family=Material+Icons'
			/>
			<meta
				name='viewport'
				content='width=device-width,initial-scale=1'
				key='viewport'
			/>
			<link rel='apple-touch-icon' href={`/apple-touch-icon.png`} key='apple' />
			<link
				rel='icon'
				type='image/png'
				sizes='32x32'
				href={`/favicon-32x32.png`}
				key='icon32'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='16x16'
				href={`/favicon-16x16.png`}
				key='icon16'
			/>
			<link rel='icon' href={`/favicon.ico`} key='favicon' />
		</>
	)
}
