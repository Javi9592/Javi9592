import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
  }

  const updateVote = async (updatedObject) => {
    const url = `${baseUrl}/${updatedObject.id}`
    const request = await axios.put(url, updatedObject)
    return request.data
  }
// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, createNew, updateVote }