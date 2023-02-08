import Link from 'next/link'
import React, { FC } from 'react'

import styles from '../styles/404.module.scss'

const Page404: FC = () => {
	return (
		<div className={styles.page404}>
			<div className={styles.page404__header}>
				<a href='/'>good deeds</a>
			</div>
			<div className={styles.page404__title}>404</div>
			<div className={styles.page404__subtitle}>
				<div className={styles.page404__subtitle_main}>Oops!</div>
				<div className={styles.page404__subtitle_secondary}>
					The page not found
				</div>
			</div>
			<div className={styles.page404__wrapper}>
				<a href='/' className={styles.page404__button}>
					Home
				</a>
				<a href='/support' className={styles.page404__button}>
					Contact us
				</a>
			</div>
		</div>
	)
}

export default Page404
