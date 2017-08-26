// @flow

export type MethodType = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH'

export type APIBadReq = {
  [key: string]: string[],
  non_field_errors?: string[],
}

export type LoginReqData = {|
  email: string,
  password: string,
|}

export type LoginResSuccess = {|
  key: string,
|}

export type BadRequest<T> = {| status: 400, ok: false, error: APIBadReq, data: T |}
export type Unauthorized<T> = {| status: 401, ok: false, error: APIBadReq, data: T |}
export type ServerError<T> = {| status: 500, ok: false, error: string, statusText: string, data: T |}
export type NetworkError<T> = {| status: -1, ok: false, error: string, data: T |}
export type OK<T> = {| status: 200, ok: true, data: T |}

export type ResponseAPI<T> = OK<T> | Unauthorized<T> | BadRequest<T> | ServerError<T> | NetworkError<T>
