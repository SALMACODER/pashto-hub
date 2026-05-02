import client from './client'

/**
 * Admin lesson endpoints. All require `protect`+`admin` on the backend
 * AND a valid CSRF token on writes (the centralized client adds it).
 */

export const listLessons = (params = {}) =>
  client.get('/admin/lessons', { params }).then((r) => r.data)

export const getLesson = (idOrSlug) =>
  client.get(`/admin/lessons/${idOrSlug}`).then((r) => r.data)

export const createLesson = (payload) =>
  client.post('/admin/lessons', payload).then((r) => r.data)

export const updateLesson = (id, payload) =>
  client.put(`/admin/lessons/${id}`, payload).then((r) => r.data)

export const deleteLesson = (id) =>
  client.delete(`/admin/lessons/${id}`).then((r) => r.data)
