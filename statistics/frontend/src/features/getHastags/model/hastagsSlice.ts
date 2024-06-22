import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type HashtagsState = {
    hashtags: string[],
}

const initialState: HashtagsState = {
	hashtags: [],
}

const hashtagsSlice = createSlice({
	name: 'hashtags',
	initialState,
	reducers: {
		setHashtags: (state, action: PayloadAction<string[]>) => {
			state.hashtags = action.payload
		},
	},
})

export {
	hashtagsSlice,
}