import {useState} from 'react'
import {fetchData} from 'shared/query'

const GET_HASHTAGS_URL = '/vk/get_members'

const MainPage = () => {
	const [hashtags, setHashtags] = useState<string[]>([])
	return (
		<div>
			{'MainPage'}
			<button
				onClick={() => fetchData(GET_HASHTAGS_URL, 'GET')
					.then(res => setHashtags(res))
					.catch(err => console.log('err = ', err))
				}
			>
				{'Получить хештеги'}
			</button>
			<div>
				{hashtags.map(hashtag => hashtag + ', ')}
			</div>
		</div>
	)
}


export {
	MainPage,
}