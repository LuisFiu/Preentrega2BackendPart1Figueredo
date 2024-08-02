import fs from "fs";

const PATH = "./src/files/cart.json";

export default class cartManager{

    constructor(){
        this.path = PATH;
        this.init();
    }

    async init (){
        if(fs.existsSync(this.path)){
            console.log({message:"Cart file already exist"});
        }
        else{
            await fs.promises.writeFile(this.path, JSON.stringify([]))
        }
    }

    async getCarts(){
        const fileData = await fs.promises.readFile(this.path,'utf-8');
        return JSON.parse(fileData);
    }

    async saveCart(carts){
        try{      
            await fs.promises.writeFile(this.path,JSON.stringify(carts,null,'\t'));
            return true
        }catch(error){
            console.log({status:"error", message: "Error writing cart", error: error})
            return false
        }
    }

    async createCart(){

        const newCart = {
            products : [],
        }

        const carts = await this.getCarts();

        if(!carts){
            return -1
        }

        if (carts.length===0){
            newCart.id = 1;
        } else {
            newCart.id = carts[carts.length-1].id+1;
        }

        carts.push(newCart);

        const created = await this.saveCart(carts);

        if(!created){
            return -1
        }

        return newCart.id

    }

    async getCartById(id) {
        try {
          const carts = await this.getCarts();
      
          if (carts.length === 0) {
            console.log({ status: "error", message: "Carts list is empty, try creating a cart first" });
            return -1;
          }
      
          const cartIndex = carts.findIndex(cart => cart.id === Number(id));
      
          if (cartIndex === -1) {
            console.log({ status: "error", message: "Cart doesn't exist" });
            return -2;
          }
      
          const findCart = carts[cartIndex];
      
          console.log({ status: "success", message: "Cart found correctly", cart: carts[cartIndex] });
            
          return findCart;
      
        } catch (error) {
          console.log({ status: "error", message: "An error occurred", error });
          return null; 
        }
      }


      async addProductByID(id, pid) {
        try {
          const carts = await this.getCarts();
          const cartIndex = carts.findIndex(cart => cart.id === Number(id));
          
          if (cartIndex === -1) {
            console.log({ status: "error", message: "Cart doesn't exist" });
            return -2;
          }
      
          const cart = carts[cartIndex];
          const cartProducts = cart.products;
          const productID = Number(pid);
      
          const productIndex = cartProducts.findIndex(product => product.product === productID);
      
          if (productIndex === -1) {
            cartProducts.push({ product: productID, quantity: 1 });
          } else {
            cartProducts[productIndex].quantity += 1;
          }
      
          await this.saveCart(carts);
          
          return cart;
        } catch (error) {
          console.log({ status: "error", message: "An error occurred", error });
          return null;
        }
      }


      async deleteProductByID(id, pid) {
        try {
          const carts = await this.getCarts();
          const cartIndex = carts.findIndex(cart => cart.id === Number(id));
          
          if (cartIndex === -1) {
            console.log({ status: "error", message: "Cart doesn't exist" });
            return -2;
          }
      
          const cart = carts[cartIndex];
          const cartProducts = cart.products;
          const productID = Number(pid);
      
          const productIndex = cartProducts.findIndex(product => product.product === productID);
      
          if (productIndex === -1) {
            return -3;
          } else {

            const deletedProduct = cartProducts.splice(productIndex, 1);
            
          }
      
          await this.saveCart(carts);
          
          return cart;
        } catch (error) {
          console.log({ status: "error", message: "An error occurred", error });
          return null;
        }
      }

}
