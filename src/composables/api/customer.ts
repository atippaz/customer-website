import baseApi from './baseApi'
export interface GetCustomerAll {
  page: number | null
  limit: number | null
  search?: string
  fav?: number[]
  province?: number[]
  age: {
    min: number | null
    max: number | null
  } | null
}
export interface CustomerResultApi {
  currentPage: number
  total: number
  totalPage: number
  data: CustomerData[]
}
export interface CustomerData {
  customerName: string
  customerId: number
  customerAge: number
  customerFavorite: string
  customerProvince: string
  customerFavoriteId: number
  customerProvinceId: number
}
export interface InsertCustomer {
  customerName: string
  customerAge: number
  customerFavorite: number
  customerProvince: number
}
export interface Customer {
  customerName: string
  customerId: number
  customerAge: number
  customerFavorite: number
  customerProvince: number
}
export default function customerApi() {
  const api = baseApi('customer')
  return {
    async getAll(query: GetCustomerAll): Promise<CustomerResultApi | null> {
      try {
        const result = await api.postMethod<CustomerResultApi>('getalluser', query)
        return result
      } catch (ex) {
        console.log(ex)
        return null
      }
    },
    async downloadExcel(query: GetCustomerAll): Promise<Blob | null> {
      try {
        const result = await api.fileDownload<Blob>('getexcel', query)
        return result
      } catch (ex) {
        console.log(ex)
        return null
      }
    },
    async findById(customerId: number): Promise<Customer | null> {
      try {
        const result = await api.getMethod<Customer>('getuser', `${customerId}`)
        return result
      } catch (ex) {
        console.log(ex)
        return null
      }
    },
    async update(updateData: Customer) {
      try {
        const result = await api.patchMethod<number>(
          'update',
          `${updateData.customerId}`,
          updateData
        )
        return result
      } catch (ex) {
        console.log(ex)
        return null
      }
    },
    async create(data: InsertCustomer) {
      try {
        const result = await api.postMethod<number>('create', data)
        return result
      } catch (ex) {
        console.log(ex)
        return null
      }
    },
    async delete(customerId: number) {
      try {
        const result = await api.deleteMethod<number>('delete', `${customerId}`)
        return result
      } catch (ex) {
        console.log(ex)
        return null
      }
    }
  }
}
