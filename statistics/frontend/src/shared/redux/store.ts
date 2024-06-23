import {configureStore} from '@reduxjs/toolkit'
import {verticesSlice} from 'entities/vertex'
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {api} from 'shared/hooks'

const store = configureStore({
	reducer: {
		vertices: verticesSlice.reducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(api.middleware),
})

type AppDispatch = typeof store.dispatch
type RootState = ReturnType<typeof store.getState>
const useAppDispatch: () => AppDispatch = useDispatch
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export {
	store,
	useAppDispatch,
	useAppSelector,
}