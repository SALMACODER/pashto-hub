import client from './client'

export const listBooks = (params = {}) =>
  client.get('/books', { params }).then((r) => r.data)

export const getBook = (idOrSlug) =>
  client.get(`/books/${idOrSlug}`).then((r) => r.data)

export const createBook = (payload) =>
  client.post('/books', payload).then((r) => r.data)

export const updateBook = (id, payload) =>
  client.put(`/books/${id}`, payload).then((r) => r.data)

export const deleteBook = (id) =>
  client.delete(`/books/${id}`).then((r) => r.data)
