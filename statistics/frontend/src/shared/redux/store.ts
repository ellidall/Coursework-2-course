import {configureStore} from '@reduxjs/toolkit'

const store = configureStore({
	reducer: {
	},
})

type AppDispatch = typeof store.dispatch
type RootState = ReturnType<typeof store.getState>

export {
	store,
	type AppDispatch,
	type RootState,
}