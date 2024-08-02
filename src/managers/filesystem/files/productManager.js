import fs from "fs";

const PATH = "./src/files/products.json";

export default class productManager{

    constructor(){
        this.path = PATH;
        this.init();
    }

    async init (){
        if(fs.existsSync(this.path)){
            console.log({message:"Products file already exist"});
        }
        else{
            await fs.promises.writeFile(this.path, JSON.stringify([]))
        }
    }

    async getProducts(){
        const fileData = await fs.promises.readFile(this.path,'utf-8');
        return JSON.parse(fileData);
    }

    async saveProducts(products){
        try{      
            await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'));
            return true
        }catch(error){
            console.log({status:"error", message: "Error writing product", error: error})
            return false
        }
    }

    async createProduct({title,description,code,price,status,stock,category}){

        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category
        }

        const products = await this.getProducts();

        if(!products){
            return -1
        }

        if (products.length===0){
            newProduct.id = 1;
        } else {
            newProduct.id = products[products.length-1].id+1;
        }

        products.push(newProduct);

        const created = await this.saveProducts(products);

        if(!created){
            return -1
        }

        return newProduct.id

    }

    async editProduct(id, updatedValues) {
        try {
          const products = await this.getProducts();
      
          if (products.length === 0) {
            console.log({ status: "error", message: "Product list is empty, try creating a product first" });
            return -1;
          }
      
          const productIndex = products.findIndex(product => product.id === Number(id));
      
          if (productIndex === -1) {
            console.log({ status: "error", message: "Product doesn't exist" });
            return -2;
          }
      
          products[productIndex] = { ...products[productIndex], ...updatedValues };
      
          console.log({ status: "success", message: "Product updated successfully", product: products[productIndex] });
      
          await this.saveProducts(products);
      
          return products[productIndex];
      
        } catch (error) {
          console.log({ status: "error", message: "An error occurred", error });
          return null; 
        }
      }
      
      async deleteProduct(id) {
        try {
          const products = await this.getProducts();
      
          if (products.length === 0) {
            console.log({ status: "error", message: "Product list is empty, try creating a product first" });
            return -1;
          }
      
          const productIndex = products.findIndex(product => product.id === Number(id));
      
          if (productIndex === -1) {
            console.log({ status: "error", message: "Product doesn't exist" });
            return -2;
          }
      
          const deletedProduct = products.splice(productIndex, 1);
      
          console.log({ status: "success", message: "Product deleted successfully", product: products[productIndex] });
      
          await this.saveProducts(products);
      
          return deletedProduct[0];
      
        } catch (error) {
          console.log({ status: "error", message: "An error occurred", error });
          return null; 
        }
      }

      async getProductById(id) {
        try {
          const products = await this.getProducts();
      
          if (products.length === 0) {
            console.log({ status: "error", message: "Product list is empty, try creating a product first" });
            return -1;
          }
      
          const productIndex = products.findIndex(product => product.id === Number(id));
      
          if (productIndex === -1) {
            console.log({ status: "error", message: "Product doesn't exist" });
            return -2;
          }
      
          const findProduct = products[productIndex];
      
          console.log({ status: "success", message: "Product found correctly", product: products[productIndex] });
            
          return findProduct;
      
        } catch (error) {
          console.log({ status: "error", message: "An error occurred", error });
          return null; 
        }
      }

}
