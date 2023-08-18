import { ProductsModel } from '../mongoose/products.model.js';

class ModelProduct {
  async getAllProducts(limit, page, query, sort) {
    let products = null;
    if (typeof query === 'string') {
      products = await ProductsModel.paginate({ $or: [{ status: query }, { category: query }] }, { limit: limit, page: page, sort: sort });
    } else {
      products = await ProductsModel.paginate({}, { limit: limit, page: page, sort: sort });
    }
    return products;
  }

  async getProduct(id) {
    const product = await ProductsModel.findById({ _id: id });
    return product;
  }

  async createProduct(title, description, code, price, status, stock, category, thumbnails) {
    const productcreated = await ProductsModel.create({ title, description, code, price, status, stock, category, thumbnails });
    return productcreated;
  }

  async updateProduct(id, title, description, code, price, status, stock, category, thumbnails) {
    const userUptaded = await ProductsModel.updateOne({ _id: id }, { title, description, code, price, status, stock, category, thumbnails });
    return userUptaded;
  }

  async deleteProduct(id) {
    const deleted = await ProductsModel.deleteOne({ _id: id });
    return deleted;
  }
}

export const modelProduct = new ModelProduct();
