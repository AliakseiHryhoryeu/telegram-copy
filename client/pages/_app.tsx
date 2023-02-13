import { AppProps } from 'next/app'
import Head from 'next/head'

import { Provider } from 'react-redux'
import { store } from 'src/store'

import { Layout, Meta } from 'src/components/'

import 'src/styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Layout>
				<Head>
					<Meta />
				</Head>
				<Component {...pageProps} />
			</Layout>
		</Provider>
	)
}

export default MyApp
