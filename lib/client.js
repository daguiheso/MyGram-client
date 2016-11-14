'use strict'

const request = require('request-promise')
const Promise = require('bluebird')

class Client {

  constructor (options) {
    // agregando opciones al contexto global de la instancia o las de por defecto que son para produccion
    this.options = options || {
      endpoints: {
        pictures: 'http://api.mygram.com/picture',
        users: 'http://api.mygram.com/user',
        auth: 'http://api.mygram.com/auth'
      }
    }
  }

  // cb opcional
  getPicture (id, cb) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.pictures}/${id}`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(cb)
  }

  savePicture (picture, token, cb) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.pictures}/`,
      body: picture,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(cb)
  }

  likePicture (id, cb) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.pictures}/${id}/like`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(cb)
  }

  listPictures (cb) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.pictures}/list`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(cb)
  }

  listPicturesByTag (tag, cb) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.pictures}/tag/${tag}`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(cb)
  }

  saveUser (user, cb) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.users}/`,
      body: user,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(cb)
  }

  getUser (username, cb) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.users}/${username}`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(cb)
  }

  auth (username, password, cb) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.auth}/`,
      body: {
        username,
        password
      },
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(cb)
  }
}

module.exports = Client
