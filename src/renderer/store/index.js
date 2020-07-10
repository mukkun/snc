const { createClient } = require('webdav')
const Store = require('electron-store')
const config = new Store()

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

    // TODO: Initialize
    
    const client = createClient(
      config.get('server.host', 'localhost') + ':' + config.get('server.port', '8080'), {
        username: config.get('server.username', 'username'),
        password: config.get('server.password', 'password')
      }
    )

    console.log('get directories ...')
    const directoryItems = await client.getDirectoryContents(config.get('server.path', '/'), {
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

    // DBの保存
    const db = new Store({
      name: 'db'
    })
    db.set('folders', folders)
    db.set('files', files)
    db.set('lastModified', (new Date()).toLocaleString())
    
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