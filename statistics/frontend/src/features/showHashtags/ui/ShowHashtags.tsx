import {useMemo, useState} from 'react'
import {useAppSelector} from 'shared/redux'
import {Button} from 'shared/ui/button'
import {countWordOccurrences} from '../libs/countWordOccurrences'
import styles from './ShowHashtags.module.css'

const ShowHashtags = () => {
	const {vertices} = useAppSelector(state => state.vertices)
	const [isVisible, setIsVisible] = useState(false)
	const hashtagsCounts = useMemo(() => countWordOccurrences(vertices), [vertices])

	return (
		<div className={styles.showHashtags}>
			<Button onClick={() => setIsVisible(!isVisible)}>
				{isVisible ? 'Cкрыть хештеги' : 'Показать хештеги'}
			</Button>
			{isVisible && vertices.length !== 0 && (
				<div className={styles.hashtagContainer}>
					{Array.from(hashtagsCounts.entries())
						.map(([hashtag, count]) => (
							<div className={styles.text}>{`${hashtag} - ${count}`}</div>
						))
					}
				</div>
			)}
		</div>
	)
}

export {
	ShowHashtags,
}