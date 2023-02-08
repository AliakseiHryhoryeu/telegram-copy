import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'

import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from './TaskInfo.module.scss'

type TaskInfoProps = {
	id: string
	title: string
	done: boolean
}

export const TaskInfo: FC<TaskInfoProps> = ({ id, title, done }) => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const router = useRouter()

	const [check, setCheck] = useState(done)

	return (
		<div
			id={id}
			className={`${styles[`taskInfo_${theme}`]} ${styles.taskInfo}`}
		>
			<div className={styles.taskInfo__wrapper}>
				<input
					className={styles.taskInfo__input}
					checked={check}
					type='checkbox'
					onChange={e => setCheck(!check)}
				/>
				<div
					className={styles.taskInfo__title}
					onClick={() => router.push('/task')}
				>
					{title}
				</div>
			</div>
		</div>
	)
}
