const socket = io();

const productsContainer = document.getElementById('productsContainer');
const productForm = document.getElementById('productForm');
const deleteProductBtn = document.getElementById('deleteProductBtn');
const deleteProductIdInput = document.getElementById('deleteProductId');

function displayProducts(products) {
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card col-md-3'; 

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description}</p>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Code: ${product.code}</li>
                    <li class="list-group-item">Price: $${product.price}</li>
                    <li class="list-group-item">Stock: ${product.stock}</li>
                    <li class="list-group-item">Category: ${product.category}</li>
                    <li class="list-group-item">ID: ${product.id}</li>
                </ul>
                <button class="btn btn-danger delete-button mt-2" data-product-id="${product.id}">Delete Product</button>
            </div>
        `;

        productsContainer.appendChild(card);
    });
}

socket.on('updateProducts', (products) => {
    console.log('Productos actualizados correctamente.');
    displayProducts(products);
});

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
            throw new Error('Error al crear el producto');
        }

        const responseData = await response.json();
        console.log('Producto creado:', responseData);

        socket.emit('newProduct', newProduct);

        productForm.reset();
    } catch (error) {
        console.error('Error al enviar datos del producto:', error.message);
    }
});

const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }

        const responseData = await response.json();
        console.log('Response from API:', responseData);

    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
    }
};

deleteProductBtn.addEventListener('click', async () => {
    const productId = deleteProductIdInput.value.trim();

    if (productId) {
        await deleteProduct(productId);
        deleteProductIdInput.value = '';
    } else {
        console.error('Por favor ingresa un ID de producto válido');
    }
});

productsContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
        const productId = event.target.dataset.productId;
        await deleteProduct(productId);
    }
});