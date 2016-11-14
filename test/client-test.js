'use strict'

const test = require('ava')
const nock = require('nock')
const mygram = require('../') // requiriendo archivo index en la raiz
const fixtures = require('./fixtures')

/*
 * Dado que nuestro proyecto de API tiene diferentes microservicios corriendo (imagenes, users, auth),
 * esto lo vamos a ver como 3 endpoints diferentes. Localmente si corremos esos microservicios c/u
 * correra un servidor http en puertos diferentes, asi que necesitamos pasarle a nuestro cliente un
 * mecanismo para poder definir programaticamente los endpoints, a la hora de lanzar a produccion no
 * tendremos ese problema ya que todo esto va estar servido bajo ng-nix, osea vamos a tener una capa
 * http que va ser la encargada de tener todos estos microservices vistos como un solo servicio a la
 * web externa. Entonces haremos nuestra clase del cliente que sea configurable, que por defecto vaya
 * a la ruta API que tendremos en produccion pero para poder probar necesitamos definir los diferentes
 * endpoints como si fueran diferentes microservicios corriendo para garantizar que las peticiones se
 * estan haciendo bien.
 */
// opciones del cliente
let options = {
  endpoints: {
    pictures: 'http://mygram.test/picture',
    users: 'http://mygram.test/user',
    auth: 'http://mygram.test/auth'
  }
}

test.beforeEach(async t => {
  t.context.client = mygram.createClient(options)
})

test('client', t => {
  const client = t.context.client

  t.is(typeof client.getPicture, 'function')
  t.is(typeof client.savePicture, 'function')
  t.is(typeof client.likePicture, 'function')
  t.is(typeof client.listPictures, 'function')
  t.is(typeof client.listPicturesByTag, 'function')
  t.is(typeof client.saveUser, 'function')
  t.is(typeof client.getUser, 'function')
  t.is(typeof client.auth, 'function')
})

// implementacion de metodos hibridos
test('getPicture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()
  // nock simulacion http
  nock(options.endpoints.pictures)
    .get(`/${image.publicId}`)
    .reply(200, image) // debera retornar 200 y la img creada

  // ejecucion del cliente
  let result = await client.getPicture(image.publicId)

  t.deepEqual(image, result)
})

test('savePicture', async t => {
  const client = t.context.client

  // como es una ruta  debemos tener token
  let token = 'xxx-xxx-xxx'
  let image = fixtures.getImage()
  let newImage = {
    src: image.src,
    description: image.description
  }

  // nock simulacion http
  nock(options.endpoints.pictures, {
    reqheaders: {
      'Authorization': `Bearer ${token}`
    }
  })
    .post('/', newImage)
    .reply(201, image) // debera retornar 200 y la img creada

  // ejecucion del cliente
  let result = await client.savePicture(newImage, token)

  t.deepEqual(result, image)
})

test('likePicture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()
  image.liked = true
  image.likes = 1

  nock(options.endpoints.pictures)
    .post(`/${image.publicId}/like`)
    .reply(200, image)

  let result = await client.likePicture(image.publicId)

  t.deepEqual(image, result)
})

test('listPicture', async t => {
  const client = t.context.client

  let images = fixtures.getImages(3)

  nock(options.endpoints.pictures)
    .get('/list')
    .reply(200, images)

  let result = await client.listPictures()

  t.deepEqual(images, result)
})

test('listPictureByTag', async t => {
  const client = t.context.client

  let images = fixtures.getImages(3)
  let tag = 'platzi'

  nock(options.endpoints.pictures)
    .get(`/tag/${tag}`)
    .reply(200, images)

  let result = await client.listPicturesByTag(tag)

  t.deepEqual(images, result)
})
