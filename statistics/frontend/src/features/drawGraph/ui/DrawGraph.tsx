import {Graph} from 'entities/graph'
import {useMemo, useState} from 'react'
import {useAppSelector} from 'shared/redux'
import {Button} from 'shared/ui/button'
import styles from './DrawGraph.module.css'

const DrawGraph = () => {
	const {vertices} = useAppSelector(state => state.vertices)
	const [isVisible, setIsVisible] = useState(false)

	const withHashtags = useMemo(
		() => vertices.filter(item => item.hashtags.length !== 0),
		[vertices])

	return (
		<div className={styles.drawGraph}>
			<Button
				className={styles.button}
				onClick={() => setIsVisible(!isVisible)}>
				{isVisible ? 'Удалить граф' : 'Показать граф'}
			</Button>
			{isVisible && (
				<div className={styles.container}>
					<Graph vertices={withHashtags} width={1080} height={700}/>
				</div>
			)}
		</div>

	)
}

export {
	DrawGraph,
}