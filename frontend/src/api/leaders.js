import client from './client'

/**
 * Public leaders API. Both list and detail return the standard envelope:
 *   { success, data: { items | leader } }
 *
 * The detail endpoint accepts either a Mongo _id or a slug, so the route
 * `/leaders/:id` keeps working even though we navigate by slug now.
 */

export const listLeaders = (params = {}) =>
  client.get('/leaders', { params }).then((r) => r.data)

export const getLeader = (idOrSlug) =>
  client.get(`/leaders/${idOrSlug}`).then((r) => r.data)
