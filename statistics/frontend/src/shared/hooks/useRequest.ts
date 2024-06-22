import {api} from 'shared/hooks'
import {fetchData} from 'shared/query'
import {MethodType} from 'shared/types'

type Params = {
    url: string,
    method: MethodType,
    params?: any,
}

const fetchDataApi = api.injectEndpoints({
	endpoints: builder => ({
		fetchData: builder.query({
			queryFn: async ({url, method, params}: Params) => await fetchData(url, method, params),
		}),
	}),
	overrideExisting: false,
})

export const {
	useFetchDataQuery,
	useLazyFetchDataQuery,
} = fetchDataApi