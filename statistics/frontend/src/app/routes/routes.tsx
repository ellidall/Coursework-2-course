import {withLayout} from 'app/providers'
import {MainPage} from 'pages/main'
import {NotFoundPage} from 'pages/notFound'
import {ReactNode} from 'react'
import {RouteObject} from 'react-router-dom'

const createRoute = (path: string, element: ReactNode): RouteObject => ({
	path,
	element: element,
})

const routes: RouteObject[] = [
	createRoute(
		'/',
		withLayout(<MainPage/>, 'Статистика хештегов постов ВКонтакте'),
	),
	createRoute(
		'/*',
		<NotFoundPage/>,
	),
]

export {
	routes,
}