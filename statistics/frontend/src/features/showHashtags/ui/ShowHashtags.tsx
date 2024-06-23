import {verticesSlice} from 'entities/vertex'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {GET_HASHTAGS_URL, UPDATE_DATA_URL} from 'shared/consts'
import {fetchData} from 'shared/query'
import {useAppDispatch, useAppSelector} from 'shared/redux'
import {countWordOccurrences} from '../libs/countWordOccurrences'
import styles from './ShowHashtags.module.css'

const ShowHashtags = () => {
	const dispatch = useAppDispatch()
	const {vertices} = useAppSelector(state => state.vertices)
	const [isVisible, setIsVisible] = useState(false)

	const hashtagsCounts = useMemo(() => countWordOccurrences(vertices), [vertices])

	// const getHashtags = useCallback(async () => {
	// 	const data = await fetchData(GET_HASHTAGS_URL, 'GET')
	//
	// 	if (data) {
	// 		dispatch(verticesSlice.actions.setVertices(data))
	// 	}
	// 	else {
	// 		alert('Запрос на получение хэштегов не смог выполниться')
	// 	}
	// }, [dispatch])

	const updateData = useCallback(async () => {
		await fetchData(UPDATE_DATA_URL, 'GET')
		// else {
		// 	alert('Запрос на обновление данных не смог выполниться')
		// }
	}, [])

	useEffect(() => {
		(async () => {
			const data = await fetchData(GET_HASHTAGS_URL, 'GET')

			if (data) {
				dispatch(verticesSlice.actions.setVertices(data))
			}
			else {
				alert('Запрос на получение хэштегов не смог выполниться')
			}
		})()
	}, [dispatch])

	return (
		<>
			{/*<button*/}
			{/*	className={styles.button}*/}
			{/*	onClick={getHashtags}*/}
			{/*>*/}
			{/*	{'Получить хештеги'}*/}
			{/*</button>*/}
			<button
				className={styles.button}
				onClick={updateData}
			>
				{'Обновить данные о хештегах'}
			</button>
			<button
				className={styles.button}
				onClick={() => setIsVisible(!isVisible)}
			>
				{isVisible ? 'Cкрыть хештеги' : 'Показать хештеги'}
			</button>
			{isVisible && vertices.length !== 0 && (
				<div className={styles.hashtagContainer}>
					{Array.from(hashtagsCounts.entries()).map(([hashtag, count]) => (
						<div>{`${hashtag} - ${count}`}</div>
					))}
				</div>
			)}
		</>
	)
}

export {
	ShowHashtags,
}