import { reactive } from 'vue'
import { defineStore } from 'pinia'

type DataType = {
	from?: string | null,
	data?: string
}

export const useScanStore = defineStore('scan-store', () => {
	const data = reactive<DataType>({})

	const hasFrom = () => !!data.from
	const getFrom = () => data?.from
	const hasData = () => !!data.data
	const getData = () => data?.data

	const setFrom = (value: string | null) => {
		data!.from = value
	}

	const setData = (value: string) => {
		data!.data = value
	}

	return {
		hasFrom,
		hasData,
		getFrom,
		getData,
		setFrom,
		setData
	}
})