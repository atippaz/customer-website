import baseApi from './baseApi'

export interface FavoriteDropdown {
  id: number
  value: string
}
export default function customerApi() {
  const api = baseApi('favorite')
  return {
    async getDropdown(): Promise<FavoriteDropdown[]> {
      try {
        const result = await api.getMethod<FavoriteDropdown[]>('dropdown')
        return result
      } catch (ex) {
        console.log(ex)
        return []
      }
    },
    async create(name: string): Promise<number | null> {
      try {
        const result = await api.postMethod<number>('create', { name })
        return result
      } catch (ex) {
        console.log(ex)
        return null
      }
    }
  }
}
