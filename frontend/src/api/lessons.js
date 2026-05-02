import client from './client'

export const listLessons = (params = {}) =>
  client.get('/lessons', { params }).then((r) => r.data)

export const getLesson = (id) =>
  client.get(`/lessons/${id}`).then((r) => r.data)
