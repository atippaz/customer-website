import baseApi from './baseApi'

export interface ProvinceDropdown {
  id: number
  value: string
}
export default function customerApi() {
  const api = baseApi('province')
  return {
    async getDropdown(): Promise<ProvinceDropdown[]> {
      try {
        const result = await api.getMethod<ProvinceDropdown[]>('dropdown')
        return result
      } catch (ex) {
        console.log(ex)
        return []
      }
    }
  }
}
