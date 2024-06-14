async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
            displayProducts(data.payload);
        } else {
            console.error('Error: Unexpected response structure', data);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

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
            </div>
        `;

        productsContainer.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', fetchProducts);
