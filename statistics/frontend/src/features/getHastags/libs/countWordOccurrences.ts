export const countWordOccurrences = (words: string[]): Map<string, number> => {
	const wordCountMap = new Map<string, number>()

	words.forEach(word => {
		const count = wordCountMap.get(word) || 0
		wordCountMap.set(word, count + 1)
	})

	return wordCountMap
}