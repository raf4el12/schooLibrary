type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  headers?: Record<string, string>
}

interface RequestContext {
  baseUrl: string
  method: HttpMethod
  endpoint: string
  data?: unknown
}

type ResponseInterceptor = (
  response: Response,
  context: RequestContext
) => Promise<Response>

export default class HttpClient {
  private baseUrl: string
  private responseInterceptors: ResponseInterceptor[] = []
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
  }

  interceptResponse(fn: ResponseInterceptor) {
    this.responseInterceptors.push(fn)
  }

  private async applyResponseInterceptors(
    response: Response,
    context: RequestContext
  ): Promise<Response> {
    let res = response
    for (const interceptor of this.responseInterceptors) {
      res = await interceptor(res, context)
    }
    return res
  }

  async request<T = unknown>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      ...options?.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const config: RequestInit = { method, headers }

    if (data !== undefined) {
      headers['Content-Type'] = 'application/json'
      config.body = JSON.stringify(data)
    }

    const context: RequestContext = {
      baseUrl: this.baseUrl,
      method,
      endpoint,
      data,
    }

    let response = await fetch(url, config)
    response = await this.applyResponseInterceptors(response, context)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Error ${response.status} en ${method} ${endpoint}`
      )
    }

    const text = await response.text()
    return text ? JSON.parse(text) : ({} as T)
  }

  async get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>('GET', endpoint, undefined, options)
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>('POST', endpoint, data, options)
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>('PUT', endpoint, data, options)
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>('PATCH', endpoint, data, options)
  }

  async delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>('DELETE', endpoint, undefined, options)
  }
}
