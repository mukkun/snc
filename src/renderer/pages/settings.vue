<template lang="pug">
  v-main.settings
    v-row
      v-col(cols="12")
        v-btn(nuxt to="/") トップ画面

      v-col(cols="12")
        v-card
          v-card-title サーバ情報
          v-simple-table
            tbody
              tr
                td Host
                td
                  v-text-field(v-model="config.server.host")
              tr
                td Port
                td
                  v-text-field(v-model="config.server.port")
              tr
                td Username
                td
                  v-text-field(v-model="config.server.user")
              tr
                td Password
                td
                  v-text-field(v-model="config.server.pass" type="false")
              tr
                td Path
                td
                  v-text-field(v-model="config.server.path")
              tr
                td Protocol
                td
                  v-select(':items'="protocols" v-model="config.server.protocol")

          v-card-actions
            v-spacer
            v-btn(@click="saveServerInfo" outlined color="primary") 保存
</template>

<script>
const Store = require('electron-store')
const store = new Store()

export default {
  data() {
    return {
      protocols: [
        'SMB',
        'WebDAV',
        'FTPS'
      ],
      config: {
        server: {
          host: store.get('server.host', 'localhost'),
          port: store.get('server.port', '8080'),
          user: store.get('server.username', 'user'),
          pass: store.get('server.password', 'pass'),
          path: store.get('server.path', '/'),
          protocol: store.get('server.protocol')
        }
      }
    }
  },
  methods: {
    saveServerInfo() {
      store.set({
        server: {
          host: this.config.server.host,
          port: this.config.server.port,
          username: this.config.server.user,
          password: this.config.server.pass,
          path: this.config.server.path,
          protocol: this.config.server.protocol
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>