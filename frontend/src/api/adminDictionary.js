import client from './client'

/** Admin-only dictionary endpoints. CSRF token + protect+admin enforced backend-side. */

export const listWords = (params = {}) =>
  client.get('/admin/dictionary', { params }).then((r) => r.data)

export const getWord = (id) =>
  client.get(`/admin/dictionary/${id}`).then((r) => r.data)

export const createWord = (payload) =>
  client.post('/admin/dictionary', payload).then((r) => r.data)

export const updateWord = (id, payload) =>
  client.put(`/admin/dictionary/${id}`, payload).then((r) => r.data)

export const deleteWord = (id) =>
  client.delete(`/admin/dictionary/${id}`).then((r) => r.data)
