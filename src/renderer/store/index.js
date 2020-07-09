const { createClient } = require('webdav')

const client = createClient(
  'https://mukuta.synology.me:5006', // 暫定
  {
    username: 'ootsuka',
    password: 'SystemIO_1125'
  }
)

export const state = () => ({
  directories: [],
  folders: [],
  files: [],
  lastModified: '',
  gettingStatus: false
})

export const mutations = {
  setDirectories(state, directories) {
    state.directories = directories
  },
  setFolders(state, folders) {
    state.folders = folders
  },
  setFiles(state, files) {
    state.files = files
  },
  clearDirectories(state, directories) {
    state.directories = []
    state.files = []
    state.folders = []
  },
  setLastModified(state, date) {
    state.lastModified = date
  },
  toggleGettingStatus(state) {
    state.gettingStatus = !state.gettingStatus
  }
}

export const actions = {
  async fetchDirectories({ commit }) {
    commit('clearDirectories')
    commit('toggleGettingStatus')

    console.log('get directories ...')
    const directoryItems = await client.getDirectoryContents('/Books/漫画', {
      deep: true
    })

    // TEST
    let folders = []
    let files = []

    // 改善
    for (let i = 0; i < directoryItems.length; i++) {
      // フォルダ
      if (directoryItems[i].type === 'directory') {
        folders.push(directoryItems[i].basename)
      }
      // ファイル
      if (directoryItems[i].type === 'file') {
        files.push(directoryItems[i].basename)
      }
    }
    console.log('complete')
    
    commit('setLastModified', (new Date()).toLocaleString())
    commit('toggleGettingStatus')
    commit('setDirectories', directoryItems)
    commit('setFolders', folders)
    commit('setFiles', files)
  }
}

export const getters = {
  getDirectories(state) {
    return state.directories
  },
  getFolders(state) {
    return state.folders
  },
  getFiles(state) {
    return state.files
  },
  getLastModified(state) {
    return state.lastModified
  },
  getGettingStatus(state) {
    return state.gettingStatus
  }
}