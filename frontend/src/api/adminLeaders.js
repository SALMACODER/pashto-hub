import client from './client'

/** Admin-only leader endpoints. CSRF token + protect+admin enforced backend-side. */

export const listLeaders = (params = {}) =>
  client.get('/admin/leaders', { params }).then((r) => r.data)

export const getLeader = (idOrSlug) =>
  client.get(`/admin/leaders/${idOrSlug}`).then((r) => r.data)

export const createLeader = (payload) =>
  client.post('/admin/leaders', payload).then((r) => r.data)

export const updateLeader = (id, payload) =>
  client.put(`/admin/leaders/${id}`, payload).then((r) => r.data)

export const deleteLeader = (id) =>
  client.delete(`/admin/leaders/${id}`).then((r) => r.data)
