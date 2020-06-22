const express = require('express')
const passport = require('passport')
const ProductsService = require('../../services/products')
const debug = require('debug')('app:server')

const cacheResponse =  require('../../utils/cacheResponse')
const { FIVE_MINUTOS_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time')

const validation = require('../../utils/middlewares/validationHandler')
const {
  productIdSchema,
  productTagSchema,
  createProductSchema,
  updateProductSchema
} = require('../../utils/schemas/products')

// JWT strategy
require('../../utils/auth/strategies/jwt')

const productsApi = (app) => {
  const router = express.Router()
  app.use('/api/products', router)

  const productsService = new ProductsService()

  router.get('/', async (req, res, next) => {
    cacheResponse(res, FIVE_MINUTOS_IN_SECONDS)
    const { tags } = req.query
    // console.log('getProducts :: req :: ', req)

    try {
      
      const products = await productsService.getProducts({ tags })

      res.status(200).json({
        data: products,
        message: 'products listed'
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/:productId', (req, res, next) => {
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)

    const { productId } =  req.params

    try {
      const product = productsService.getProduct({ productId })

      res.status(200).json({
        data: product,
        message: 'Products retieve'
      })
    } catch (error) {
      next(error)
    }
  })

  router.post('/', validation(createProductSchema), async (req, res, next) => {
    const { body: infoProduct } = req
    // console.log('createProduct :: infoProduct :: ', infoProduct)

    try {
      const createdProduct = await productsService.createProduct(infoProduct)

      res.status(201).json({
        data: createdProduct,
        message: 'Products Created'
      })
    } catch (error) {
      next(error)
    }
  })

  router.put('/:productId',
    passport.authenticate('jwt', { session: false }),
    validation({ productId: productIdSchema }, 'params'),
    validation(updateProductSchema),
    async (req, res, next) => {
      const { productId } = req.params
      const { body: infoProduct } = req

      debug('updateProduct :: infoProduct :: ', infoProduct)

      try {
        const product = await productsService.updateProduct(productId, infoProduct)

        res.status(200).json({
          data: product,
          message: 'Products updated'
        })
      } catch (error) {
        next(error)
      }
  })

  router.delete('/:productId',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
    const { productId } = req.params
    debug('deleteProduct :: req.params :: ', req.params)

    try {
      const product = await product.ProductsService.deleteProduct({ productId })

      res.status(200).json({
        data: product,
        message: 'Products deleted'
      })
    } catch (error) {
      next(error)
    }
  })
}
module.exports = productsApi