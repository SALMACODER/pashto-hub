import client from './client'

/**
 * Categories are public to read (used by the storefront filter UI) and
 * admin-only to mutate.
 */

export const listCategories = () =>
  client.get('/categories').then((r) => r.data)

export const createCategory = (payload) =>
  client.post('/admin/categories', payload).then((r) => r.data)

export const updateCategory = (id, payload) =>
  client.put(`/admin/categories/${id}`, payload).then((r) => r.data)

export const deleteCategory = (id) =>
  client.delete(`/admin/categories/${id}`).then((r) => r.data)
