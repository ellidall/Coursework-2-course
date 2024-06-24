import {useCallback} from 'react'
import {UPDATE_DATA_URL} from 'shared/consts'
import {fetchData} from 'shared/query'
import {Button} from 'shared/ui/button'
import styles from './UpdateData.module.css'

const UpdateHashtags = () => {
	const updateData = useCallback(async () => {
		await fetchData(UPDATE_DATA_URL, 'GET')
		// else {
		// 	alert('Запрос на обновление данных не смог выполниться')
		// }
	}, [])

	return (
		<div className={styles.updateData}>
			<Button onClick={updateData}>{'Обновить данные о хештегах'}</Button>
		</div>
	)
}

export {
	UpdateHashtags,
}