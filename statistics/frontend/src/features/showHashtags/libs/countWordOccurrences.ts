import {VertexType} from 'shared/types'

export const countWordOccurrences = (vertices: VertexType[]): Map<string, number> => {
	const hashtags = vertices.flatMap(vertex => vertex.hashtags)
	// const hashtags: string[] = []
	// vertices.map(vertex => hashtags.push(...vertex.hashtags))

	const wordCountMap = new Map<string, number>()

	hashtags.forEach(hashtag => {
		const count = wordCountMap.get(hashtag) || 0
		wordCountMap.set(hashtag, count + 1)
	})

	return wordCountMap
}