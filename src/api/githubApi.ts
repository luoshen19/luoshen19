import axios from 'axios'

const githubApi = axios.create({
  baseURL: import.meta.env.VITE_RESOURCE_URL,
  timeout: 5000
})

export async function getResource(): Promise<DbEntity> {
  try {
    const resp = await githubApi.get('/db.json')
    return new DbEntity(resp.data['musicList'], resp.data['imageList'])
  } catch (error) {
    console.log(error)
    throw error
  }
}

export class DbEntity {
  public musicList: string[]
  public imageList: string[]

  constructor(musicList: string[], imageList: string[]) {
    this.musicList = musicList
    this.imageList = imageList
  }
}
