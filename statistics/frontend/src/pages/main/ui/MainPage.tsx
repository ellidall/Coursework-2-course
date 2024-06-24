import {Spin} from 'antd'
import {verticesSlice} from 'entities/vertex'
import {DrawGraph} from 'features/drawGraph'
import {ShowHashtags} from 'features/showHashtags'
import {UpdateHashtags} from 'features/updateHashtags'
import {useEffect, useState} from 'react'
import {GET_HASHTAGS_URL} from 'shared/consts'
import {fetchData} from 'shared/query'
import {useAppDispatch} from 'shared/redux'
import styles from './MainPage.module.css'

const MainPage = () => {
	const dispatch = useAppDispatch()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		(async () => {
			const data = await fetchData(GET_HASHTAGS_URL, 'GET')

			if (data) {
				dispatch(verticesSlice.actions.setVertices(data))
			}
			else {
				alert('Запрос на получение хэштегов не смог выполниться')
			}

			setIsLoading(false)
		})()

	}, [dispatch])

	return (
		<>
			{isLoading && <Spin className={styles.spin} size="large"/>}
			{!isLoading && (
				<div className={styles.main}>
					<UpdateHashtags/>
					<ShowHashtags/>
					<DrawGraph/>
				</div>
			)}
		</>
	)
}

export {
	MainPage,
}