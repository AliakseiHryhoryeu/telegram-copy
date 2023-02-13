import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { AddTaskBtn, TaskInfo } from 'src/components/Task/'
import { MainPopup, Header } from 'src/components/Main/'
import { TaskCreate } from 'src/components/Task/'

import { useActions } from 'src/hooks/useActions'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from '../styles/main.module.scss'

const Home: FC = () => {
	const { theme, isAuth, tasks } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
			isAuth: state.user.isAuth,
			tasks: state.user.activeUser.tasks,
		}
	})
	const router = useRouter()
	const allActions = useActions()

	useEffect(() => {
		if (isAuth == false) {
			router.push('/login')
		}
	})
	return (
		<>
			<Head>
				<title>Good Deeds</title>
			</Head>
			<main className={styles.main}>
				<Header />
				{tasks.map(item => {
					return (
						<TaskInfo
							key={item._id}
							taskid={item._id}
							title={item.title}
							checked={item.checked}
						/>
					)
				})}
				<AddTaskBtn />
			</main>
			<TaskCreate />
			<MainPopup />
		</>
	)
}

export default Home
