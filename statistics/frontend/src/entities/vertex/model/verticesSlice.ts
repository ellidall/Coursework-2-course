import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {VertexType} from 'shared/types'

type HashtagsState = {
    vertices: VertexType[],
}

const initialState: HashtagsState = {
	vertices: [],
}

const verticesSlice = createSlice({
	name: 'vertices',
	initialState,
	reducers: {
		setVertices: (state, action: PayloadAction<VertexType[]>) => {
			state.vertices = action.payload
		},
	},
})

export {
	verticesSlice,
}