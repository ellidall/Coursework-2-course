type MethodType = 'POST' | 'GET'

export const fetchData = async (url: string, method: MethodType, params?: any) => {
	const data: any = {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
	}

	if (method === 'POST') {
		data.body = JSON.stringify(params || {})
	}

	const response = await fetch(url, data)
	if (!response.ok) {
		throw new Error('Network response was not ok')
	}

	return await response.json()
}