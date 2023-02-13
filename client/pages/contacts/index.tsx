import React, { useState } from 'react'
import Head from 'next/head'
// import Link from 'next/link'
// import { Projects } from 'src/components'
import styles from 'src/styles/contacts.module.scss'
import { useTypedSelector } from 'src/hooks/useTypedSelector'
import { RootState } from 'src/store'
// import { MessageBtnIcon } from 'src/components/svg/MessageBtnIcon'
// import { DotsIcon } from 'src/components/svg/DotsIcon'
import { CrossIcon } from 'src/components/svg/CrossIcon'
import { useActions } from 'src/hooks/useActions'
import { useRouter } from 'next/router'
import { ArrowBack } from 'src/components/svg/ArrowBack'
import {
	useContactAcceptMutation,
	useContactDeleteMutation,
	useContactRejectMutation,
} from 'src/store/user/user.api'

const ContactsPage = () => {
	const { theme, contactsPending, contactsRequests, contactsAdded } =
		useTypedSelector((state: RootState) => {
			return {
				theme: state.theme.theme,
				contactsPending: state.user.activeUser.contacts.pending,
				contactsRequests: state.user.activeUser.contacts.requests,
				contactsAdded: state.user.activeUser.contacts.added,
			}
		})
	// const [loginRequest, { isLoading: isLoading }] = useLoginMutation()

	const [deleteContactRequest, { isLoading: isLoadingDel }] =
		useContactDeleteMutation()
	const [acceptContactRequest, { isLoading: isLoadingAccept }] =
		useContactAcceptMutation()
	const [rejectContactRequest, { isLoading: isLoading }] =
		useContactRejectMutation()

	// const [pendingContactRequest, { isLoading: isLoadingPending }] =
	// 	useContactDeleteMutation()
	// const [findContactRequest, { isLoading: isLoadingFind }] =
	// 	useContactDeleteMutation()

	const [inputValue, setInputhValue] = useState('')
	const router = useRouter()
	const waitRequest = (nowInputValue: string) => {
		setTimeout(() => {
			if (nowInputValue == inputValue) {
				// request to server
			}
		}, 1000)
	}
	const allActions = useActions()

	return (
		<>
			<Head>
				<title>Contacts</title>
			</Head>
			<div className={`${styles[`contacts_${theme}`]} ${styles.contacts}`}>
				<div className={`${styles[`header_${theme}`]} ${styles.header}`}>
					<div className={styles.header__wrapper}>
						<div
							className={styles.header__popup}
							onClick={() => router.push('/')}
						>
							<ArrowBack />
						</div>
						<input
							className={styles.header__search}
							value={inputValue}
							onChange={e => {
								setInputhValue(e.target.value)
								waitRequest(e.target.value)
							}}
							type='text'
							placeholder='Search...'
						/>
					</div>
				</div>

				<div className={styles.contacts__container}>
					{inputValue == '' && (
						<>
							<div className={styles.contacts__title}>Contacts</div>
							{contactsAdded.map(item => {
								return (
									<div className={styles.contacts__item} key={item._id}>
										<div className={styles.contacts__item__left}>
											<div className={styles.contacts__photo}></div>
											<div className={styles.contacts__username}>
												{item.username}
											</div>
										</div>
										<div
											className={styles.contacts__item_popup}
											onClick={() => {
												deleteContactRequest({ contactid: item._id })
											}}
										>
											{/* <DotsIcon /> */}
											Remove
										</div>
									</div>
								)
							})}

							<div className={styles.contacts__title}>Contact requests</div>

							{contactsRequests.map(item => {
								return (
									<div className={styles.contacts__item} key={item._id}>
										<div className={styles.contacts__item__left}>
											<div className={styles.contacts__photo}></div>
											<div className={styles.contacts__username}>
												{item.username}
											</div>
										</div>
										<div className={styles.contacts__item__right}>
											<div
												className={styles.contacts__request_accept}
												onClick={() => {
													acceptContactRequest({ contactid: item._id })
												}}
											>
												Accept
											</div>
											<div
												className={styles.contacts__request_reject}
												onClick={() => {
													rejectContactRequest({ contactid: item._id })
												}}
											>
												<CrossIcon />
											</div>
										</div>
									</div>
								)
							})}
						</>
					)}
					{inputValue !== ''}
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
