import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
// import Link from 'next/link'
import { AddTaskBtn, TaskInfo } from 'src/components/Task/'
import { MainPopup, Header } from 'src/components/Main/'

import { TaskUpdate } from 'src/components/Task/'

import styles from '../styles/main.module.scss'

const Home: FC = () => {
	return (
		<>
			<Head>
				<title>Good Deeds</title>
			</Head>
			<main className={styles.main}>
				<Header />
				<TaskInfo id='124124' title='good task title' done={true} />
				<TaskInfo id='1241224' title='good task title' done={true} />
				<TaskInfo id='1241w1224' title='good task title' done={true} />
				<TaskInfo id='124q211124' title='good task title' done={true} />
				<TaskInfo id='124saghas124' title='good task title' done={true} />
				<TaskInfo id='12dashaa4124' title='good task title' done={true} />
				<AddTaskBtn />
			</main>
			<TaskUpdate />
			<MainPopup />
		</>
	)
}

export default Home
