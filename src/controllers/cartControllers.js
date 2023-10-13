import CartService from "../services/cartServices.js";
import ProductManager from "../dao/ProductManager.js";
import ticketController from "./ticketController.js";
import { v4 as uuidv4 } from "uuid"


class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  async createCart(req, res) {
    try {
      const newCart = await this.cartService.createCart();
      res.send(newCart);
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async getCart(req, res) {
    try {
      const cart = await this.cartService.getCart(req.params.cid);
      res.send({ products: cart.products });
    } catch (error) {
      console.log("hola en cart controller");
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.addProductToCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateQuantityProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await this.cartService.updateQuantityProductFromCart(
        cid,
        pid,
        quantity
      );
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const cid = req.params.cid;
      const products = req.body.products;
      await this.cartService.updateCart(cid, products);
      res.send({
        status: "ok",
        message: "El producto se agregó correctamente!",
      });
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.deleteProductFromCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async deleteProductsFromCart(req, res) {
    try {
      const cid = req.params.cid;
      const result = await this.cartService.deleteProductsFromCart(cid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async createPurchaseTicket(req, res) {
    console.log("Ruta /carts/:cid/purchase accedida");

    try {
      console.log("req.user:", req.user);
      if (!req.user || !req.user.id) {
        console.error("req.user no está definido");
        return res.status(400).json({ error: "Usuario no definido" });
      }
      const cart = await this.cartService.getCart(req.params.cid);

      const productManager = new ProductManager();

      for (const item of cart.products) {
        const product = await productManager.getProductById(item.product);

        if (!product) {
          return res
            .status(404)
            .json({ error: `Producto ${item.product} no encontrado` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ error: "Stock insuficiente" });
        }

        const newStock = product.stock - item.quantity;
        await productManager.updateProduct(item.product, { stock: newStock });
      }

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      console.log("Productos en el carrito:", cart.products);
      const totalAmount = cart.products.reduce((total, product) => {
        console.log(
          "Producto:",
          product.product,
          "Precio:",
          product.product.price,
          "Cantidad:",
          product.quantity
        );
        return total + product.product.price * product.quantity;
      }, 0);

      console.log("Total Amount calculado:", totalAmount);

      const ticketData = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: req.user.id,
      };

      console.log("Ticket Data justo antes de crear el ticket:", ticketData);
      const ticketCreated = await ticketController.createTicket(
        { body: ticketData },
        res
      );
      console.log("Ticket Creado:", ticketCreated);
    } catch (error) {
      console.error("Error específico al crear el ticket de compra:", error);
      res.status(500).json({ error: "Error al crear el ticket de compra" });
    }
  }

  async getPurchase(req, res) {
    try {
      const cid = req.params.cid;
      const purchase = await this.cartService.getCart(cid);

      if (purchase) {
        res.json({ status: "success", data: purchase });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Compra no encontrada" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor" });
    }
  }
}

export default new CartController();
