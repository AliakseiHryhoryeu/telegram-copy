import React, { useState } from 'react'
import Head from 'next/head'
// import Link from 'next/link'
// import { Projects } from 'src/components'
import styles from '../../styles/task.module.scss'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
import Header from 'src/components/Task/Header'
import { MessageBtnIcon } from 'src/components/svg/MessageBtnIcon'

const TaskPage = () => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const [messageInput, updateMessageInput] = useState('')

	return (
		<>
			<Head>
				<title>Task info</title>
			</Head>
			<div className={`${styles[`task_${theme}`]} ${styles.task}`}>
				<Header />

				<div className={styles.task__container}>
					<div className={styles.task__description__wrapper}>
						<div className={styles.task__description_title}>title</div>
						<div className={styles.task__description}>
							xjasgoghosahoga sgsakn sgaas jiosgajipsagjipjsgapjopsag sagjsaogm
							skoamg asghska gasplg as g as g ags g as gk
						</div>
					</div>
					<div className={styles.task__comment}>
						<div className={styles.task__comment__username}>user1</div>
						<p>
							saogaohisaiohasg hohgshasghogsahoasgho sagjasghl asghska jgas gasj
						</p>
					</div>
					<div className={styles.task__comment}>
						<div className={styles.task__comment__username}>user1</div>
						<p>
							saogaohisaiohasg hohgshasghogsahoasgho sagjasghl asghska jgas gasj
						</p>
					</div>
					<div className={styles.task__comment}>
						<div className={styles.task__comment__username}>user1</div>
						<p>
							saogaohisaiohasg hohgshasghogsahoasgho sagjasghl asghska jgas gasj
						</p>
					</div>
				</div>
				<div className={styles.task__input__container}>
					<div className={styles.task__input__wrapper}>
						<textarea
							className={styles.task__input}
							value={messageInput}
							onChange={e => updateMessageInput(e.target.value)}
						/>
						<MessageBtnIcon />
					</div>
				</div>
			</div>
		</>
	)
}

export default TaskPage
