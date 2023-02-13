import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'

import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'

import styles from './TaskInfo.module.scss'
import { useActions } from 'src/hooks/useActions'
import { useUpdateTaskMutation } from 'src/store/tasks/tasks.api'

type TaskInfoProps = {
	taskid: string
	title: string
	checked: boolean
}

export const TaskInfo: FC<TaskInfoProps> = ({ taskid, title, checked }) => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const [done, setCheck] = useState(checked)

	const [updateTaskRequest, { isLoading: isLoading }] = useUpdateTaskMutation()

	const toggleCheckbox = () => {
		setCheck(!done)

		updateTaskRequest({
			taskid: taskid,
			checked: !checked,
		})
	}
	const router = useRouter()
	const allActions = useActions()

	return (
		<div
			id={taskid}
			className={`${styles[`taskInfo_${theme}`]} ${styles.taskInfo}`}
		>
			<div className={styles.taskInfo__wrapper}>
				<input
					className={styles.taskInfo__input}
					checked={done}
					type='checkbox'
					onChange={e => toggleCheckbox()}
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
