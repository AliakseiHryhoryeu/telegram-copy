import { FC, ReactNode, useEffect } from 'react'
import { useActions } from 'src/hooks/useActions'
import { useAuthMutation } from 'src/store/user/user.api'

// import { Header } from 'src/components/'

type layoutProps = {
	children: ReactNode
}

export const Layout: FC<layoutProps> = ({ children }) => {
	const [authRequest, { isLoading: isLoading }] = useAuthMutation()

	const allActions = useActions()
	useEffect(() => {
		allActions.updateToken()
		authRequest({})
	}, [])

	return (
		<>
			{/* <Header /> */}
			{children}
		</>
	)
}
