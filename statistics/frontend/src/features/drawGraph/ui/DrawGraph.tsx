import {useState} from 'react'
import {useAppSelector} from 'shared/redux'
import styles from '../../showHashtags/ui/ShowHashtags.module.css'
import {Graph} from './Graph'

const DrawGraph = () => {
	const {vertices} = useAppSelector(state => state.vertices)
	const [isVisible, setIsVisible] = useState(false)

	return (
		<>
			<button
				className={styles.button}
				onClick={() => setIsVisible(!isVisible)}
			>
				{isVisible ? 'Cкрыть хештеги' : 'Показать хештеги'}
			</button>
			{isVisible && (
				<Graph
					vertices={vertices.filter(item => item.hashtags.length !== 0)}
					width={800}
					height={800}
				/>
			)}
		</>
	)
}

export {
	DrawGraph,
}