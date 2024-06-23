import {DrawGraph} from 'features/drawGraph'
import {ShowHashtags} from 'features/showHashtags'

const MainPage = () => (
	<div>
		{'MainPage'}
		<ShowHashtags/>
		<DrawGraph/>
	</div>
)

export {
	MainPage,
}