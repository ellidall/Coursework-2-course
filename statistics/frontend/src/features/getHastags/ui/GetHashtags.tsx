import {useCallback} from 'react'
import {GET_HASHTAGS_URL} from 'shared/consts'
// import {useLazyFetchDataQuery} from 'shared/hooks'
import {fetchData} from 'shared/query'
import {useAppDispatch, useAppSelector} from 'shared/redux'
import {countWordOccurrences} from '../libs/countWordOccurrences'
import {hashtagsSlice} from '../model/hastagsSlice'
import styles from './GetHashtags.module.css'

const GetHashtags = () => {
	const dispatch = useAppDispatch()
	const {hashtags} = useAppSelector(state => state.hashtags)
	/*const [
		getHashtags,
		{isLoading, error},
	] = useLazyFetchDataQuery({refetchOnFocus: true, refetchOnReconnect: true})*/

	const handleClick = useCallback(async () => {
		/*const data = getHashtags({
			url: GET_HASHTAGS_URL,
			method: 'GET',
		})*/

		const data = await fetchData(GET_HASHTAGS_URL, 'GET')

		if (data) {
			dispatch(hashtagsSlice.actions.setHashtags(data))
		}
		else {
			alert('Запрос на получение хэштегов не смог выполниться')
		}
	}, [dispatch])

	return (
		<>
			<button
				className={styles.button}
				onClick={handleClick}
				/*disabled={isLoading}*/
			>
				{'Получить хештеги'}
			</button>
			{hashtags.length !== 0 && (
				<div className={styles.hashtagContainer}>
					{Array.from(countWordOccurrences(hashtags).entries()).map(([hashtag, count]) => (
						<div>{`${hashtag} - ${count}`}</div>
					))}
				</div>
			)}
			<div style={{height: 1000}}></div>
		</>
	)
}

export {
	GetHashtags,
}