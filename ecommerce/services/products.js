const productsMocks = require('../utils/mocks/products')
const MongoLib = require('../lib/mongo')
const debug = require('debug')('app:server')

class ProductsService {
  constructor () {
    this.collection = 'products'
    this.mongoDB = new MongoLib()
  }

  async getProducts({ tags }) {
    const query = tags && { tags: {$in: tags } }
    const products = await this.mongoDB.getAll(this.collection, query)
    return products || []
  }

  async getProduct({ productId }) {
    if (!productId) return {}
    product = await this.mongoDB.getOne(this.collection, productId)
    return product || {}
  }

  async createProduct(product) {
    debug('createProduct ::', product)
    const createProductId = await this.mongoDB.create(this.collection, product)
    return createProductId
  }

  async updateProduct(productId, product) {
    const updateProductId = await this.mongoDB.update(
      this.collection,
      productId,
      product
    )
    return updateProductId
  }

  async deleteProduct({ productId }) {
    const deleteProductId = await this.mongoDB.delete(this.collection, productId)
    return deleteProductId
  }
}

module.exports = ProductsService