<template lang="pug">
  v-main.index
    v-container
      v-row
        v-col(cols="12")
          v-btn(nuxt to="/settings") 設定画面

        v-col(cols="12")
          v-text-field(label="Search" clearable v-model="search" @input="inputSearch")

        v-col(cols="6")
          v-card(':loading'="$store.getters.getGettingStatus")
            v-card-title データベース
            v-simple-table
              tbody
                tr
                  td 最終更新日時
                  td {{ data.lastModified }}
                  //- td {{ $store.getters.getLastModified }}
                tr
                  td フォルダ数
                  td {{ data.folders.length }}
                  //- td {{ $store.getters.getFolders.length }}
                tr
                  td ファイル数
                  td {{ data.files.length }}
                  //- td {{ $store.getters.getFiles.length }}

            v-card-actions
              v-spacer
              v-btn(@click="fetchDirectories" outlined color="primary") 更新

        v-col(cols="6")
          v-card
            v-card-title クリップボード
            v-simple-table
              tbody
                tr
                  td テキスト
                  td {{ clipboard.text }}

        v-col(cols="6")
          v-card
            v-card-title フォルダ
            v-simple-table
              tbody
                tr
                  td フォルダ数
                  td {{ clipboard.folders.length }}
                tr
                  td フォルダ一覧
                  td
                    v-list(dense)
                      v-list-item-group
                        v-list-item(v-for="(item, i) in clipboard.folders" ':key'="i")
                          v-list-item-content
                            v-list-item-title(v-text="item")
        v-col(cols="6")
          v-card
            v-card-title ファイル
            v-simple-table
              tbody
                tr
                  td ファイル数
                  td {{ clipboard.files.length }}
                tr
                  td ファイル一覧
                  td
                    v-list(dense)
                      v-list-item-group
                        v-list-item(v-for="(item, i) in clipboard.files" ':key'="i")
                          v-list-item-content
                            v-list-item-title(v-text="item")
</template>

<script>
import { remote, clipboard } from 'electron'
const Store = require('electron-store')
const db = new Store({
  name: 'db'
})

export default {
  data() {
    return {
      clipboard: {
        text: '',
        folders: [],
        files: [],
        status: false
      },
      search: null,
      data: {
        folders: [],
        files: [],
        lastModified: '-'
      }
    }
  },
  created() {
    // NARUTO 異世界転生
    // clipboard
    this.clipboard.text = clipboard.readText()

    setInterval(() => {
      const before = this.clipboard.text
      const after = clipboard.readText()
      this.clipboard.text = after

      if (before !== after) {
        // 検索処理
        this.searchFolder(after)
      }
    }, 500)
  },
  mounted() {
    this.reloadDataBase()
  },
  methods: {
    openURL (url) {
      remote.shell.openExternal(url)
    },
    reloadDataBase() {
      this.data.folders = db.get('folders', [])
      this.data.files = db.get('files', [])
      this.data.lastModified = db.get('lastModified', '-')
    },
    async fetchDirectories() {
      await this.$store.dispatch('fetchDirectories')

      this.reloadDataBase()
    },
    searchFolder(text) {
      // フォルダ
      let folders = []

      this.data.folders.forEach(folder => {
        if (folder.indexOf(text) > -1) {
          folders.push(folder)
        }
      })

      // 存在
      if (folders.length !== 0) {
        this.clipboard.folders = folders

        // ファイル検索
        this.searchFile(text)

      } else {
        this.clearInfo()
      }
    },
    searchFile(text) {
      // ファイル検索
      let files = []
      // this.$store.getters.getFiles.forEach(file => {
      this.data.files.forEach(file => {
        if (file.indexOf(text) > -1) {
          files.push(file)
        }
      })

      files.sort()

      this.clipboard.files = files
    },
    clearInfo() {
      this.clipboard.folders = []
      this.clipboard.files = []
    },
    inputSearch() {
      // 暫定処理(3文字以上)
      if (this.search.length > 2) {
        this.searchFolder(this.search)
      }
    }
  }
}
</script>

<style lang="stylus"></style>
