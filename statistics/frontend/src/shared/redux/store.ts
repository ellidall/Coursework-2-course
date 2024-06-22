import {configureStore} from '@reduxjs/toolkit'
import {hashtagsSlice} from 'features/getHastags'
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {api} from 'shared/hooks'

const store = configureStore({
	reducer: {
		hashtags: hashtagsSlice.reducer,
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