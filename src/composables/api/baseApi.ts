export default function Api(controller: string) {
  const baseUrl = import.meta.env.VITE_BASE_API
  return {
    async getMethod<T>(action: string, param: string | null = null) {
      const parametor = param ? `/${param}` : ''
      const response = await fetch(baseUrl + controller + `/${action}` + parametor, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })
      const result = response.json() as T
      return result
    },
    async postMethod<T>(action: string, payload: object | null = null) {
      const response = await fetch(baseUrl + controller + `/${action}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-type': 'application/json'
        }
      })
      const result = response.json() as T
      console.log(result)
      return result
    },
    async patchMethod<T>(action: string, id: string, payload: object | null = null) {
      const response = await fetch(baseUrl + controller + `/${action}` + `/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
          'Content-type': 'application/json'
        }
      })
      const result = response.json() as T
      console.log(result)
      return result
    },
    async deleteMethod<T>(action: string, id: string) {
      const response = await fetch(baseUrl + controller + `/${action}` + `/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        }
      })
      const result = response.json() as T
      console.log(result)
      return result
    },
    async fileDownload<T>(action: string, payload: object | null = null) {
      const response = await fetch(baseUrl + controller + `/${action}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-type': 'application/json'
        }
      })
      const result = response.blob() as T
      return result
    }
  }
}
