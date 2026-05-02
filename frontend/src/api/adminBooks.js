import client from './client'

/**
 * Admin-only book endpoints. All require `protect`+`admin` on the backend
 * AND a valid CSRF token on writes (the centralized client adds it).
 */

export const listBooks = (params = {}) =>
  client.get('/admin/books', { params }).then((r) => r.data)

export const getBook = (idOrSlug) =>
  client.get(`/admin/books/${idOrSlug}`).then((r) => r.data)

export const createBook = (payload) =>
  client.post('/admin/books', payload).then((r) => r.data)

export const updateBook = (id, payload) =>
  client.put(`/admin/books/${id}`, payload).then((r) => r.data)

export const deleteBook = (id) =>
  client.delete(`/admin/books/${id}`).then((r) => r.data)
