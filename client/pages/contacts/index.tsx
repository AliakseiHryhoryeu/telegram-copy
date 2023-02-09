import React, { useState } from 'react'
import Head from 'next/head'
// import Link from 'next/link'
// import { Projects } from 'src/components'
import styles from '../../styles/contacts.module.scss'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
import Header from 'src/components/Contacts/Header'
import { MessageBtnIcon } from 'src/components/svg/MessageBtnIcon'
import { DotsIcon } from 'src/components/svg/DotsIcon'
import { CrossIcon } from 'src/components/svg/CrossIcon'

const ContactsPage = () => {
	const { theme } = useTypedSelector((state: RootState) => {
		return {
			theme: state.theme.theme,
		}
	})
	const [messageInput, updateMessageInput] = useState('')

	return (
		<>
			<Head>
				<title>Contacts</title>
			</Head>
			<div className={`${styles[`contacts_${theme}`]} ${styles.contacts}`}>
				<Header route='/' />

				<div className={styles.contacts__container}>
					<div className={styles.contacts__title}>Contacts</div>
					<div className={styles.contacts__item}>
						<div className={styles.contacts__item__left}>
							<div className={styles.contacts__photo}></div>
							<div className={styles.contacts__username}>nickname1</div>
						</div>
						<div className={styles.contacts__item_popup}>
							{/* <DotsIcon /> */}
							Remove
						</div>
					</div>
					<div className={styles.contacts__title}>Contact requests</div>
					<div className={styles.contacts__item}>
						<div className={styles.contacts__item__left}>
							<div className={styles.contacts__photo}></div>
							<div className={styles.contacts__username}>nickname1</div>
						</div>
						<div className={styles.contacts__item__right}>
							<div className={styles.contacts__request_accept}>Accept</div>
							<div className={styles.contacts__request_reject}>
								<CrossIcon />
							</div>
						</div>
					</div>
					{/* <div className=absolut>Loading</div> */}
					{/* <div className=absolut>user not found</div> */}

					{/* if search input not null */}
					{/* <div className=contacts__item>
						<div className=contacts__photo></div>
						<div className=contacts__username>nickname1</div>
						<div className=contacts__username-popup>Send request</div>
					</div> */}
					{/* if users not found*/}
					{/* <div className=>user not found</div> */}
					{/* searching */}
					{/* <div className=>Loading...</div> */}
				</div>
			</div>
		</>
	)
}

export default ContactsPage
