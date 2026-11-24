import { useEffect, useState } from "react";
import api from "../services/api";

const emptyProduct = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: ""
};

const getErrorMessage = (error) =>
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    "Unable to complete the product request";

function ProductComponent() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState(emptyProduct);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [failedImageIds, setFailedImageIds] = useState([]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/product/getAllProduct");
            setProducts(response.data.productData || []);
        } catch (error) {
            setMessage(getErrorMessage(error));
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadInitialProducts = async () => {
            try {
                const response = await api.get("/product/getAllProduct");
                if (isMounted) {
                    setProducts(response.data.productData || []);
                }
            } catch (error) {
                if (isMounted) {
                    setMessage(getErrorMessage(error));
                    setMessageType("error");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadInitialProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const resetForm = () => {
        setFormData(emptyProduct);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setMessage("");

        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            image: formData.image || ""
        };

        try {
            if (editingId) {
                await api.post(`/product/updateProduct/${editingId}`, payload);
                setMessage("Product updated successfully");
            } else {
                await api.post("/product/createProduct", payload);
                setMessage("Product created successfully");
            }
            setMessageType("success");
            resetForm();
            await fetchProducts();
        } catch (error) {
            setMessage(getErrorMessage(error));
            setMessageType("error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price ?? ""),
            stock: String(product.stock ?? ""),
            category: product.category || "",
            image: product.image || ""
        });
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await api.post(`/product/deleteProduct/${productId}`);
            setProducts((current) => current.filter((product) => product._id !== productId));
            setMessage("Product deleted successfully");
            setMessageType("success");
            if (editingId === productId) resetForm();
        } catch (error) {
            setMessage(getErrorMessage(error));
            setMessageType("error");
        }
    };

    const handleImageError = (productId) => {
        setFailedImageIds((current) =>
            current.includes(productId) ? current : [...current, productId]
        );
    };

    return (
        <section className="product-section">
            <div className="product-heading">
                <div>
                    <span className="eyebrow">Inventory</span>
                    <h2>Products</h2>
                </div>
                {editingId && (
                    <button className="secondary-button" type="button" onClick={resetForm}>
                        Cancel edit
                    </button>
                )}
            </div>

            {message && (
                <p className={`form-message ${messageType}`} role="status">
                    {message}
                </p>
            )}

            <form className="product-form" onSubmit={handleSubmit}>
                <div className="product-fields">
                    <label>
                        Name
                        <input name="name" value={formData.name} onChange={handleChange} minLength={3} maxLength={100} required />
                    </label>
                    <label>
                        Category
                        <input name="category" value={formData.category} onChange={handleChange} required />
                    </label>
                    <label>
                        Price
                        <input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
                    </label>
                    <label>
                        Stock
                        <input name="stock" type="number" min="0" step="1" value={formData.stock} onChange={handleChange} required />
                    </label>
                    <label className="full-field">
                        Description
                        <textarea name="description" value={formData.description} onChange={handleChange} maxLength={1000} required />
                    </label>
                    <label className="full-field">
                        Image URL
                        <input name="image" type="url" value={formData.image} onChange={handleChange} placeholder="https://example.com/product.jpg" />
                    </label>
                </div>
                <button className="primary-button product-submit" type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : editingId ? "Update product" : "Add product"}
                </button>
            </form>

            <div className="product-list" aria-live="polite">
                {isLoading ? (
                    <p className="empty-state">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="empty-state">No products have been added yet.</p>
                ) : (
                    products.map((product) => (
                        <article className="product-card" key={product._id}>
                            {product.image && !failedImageIds.includes(product._id) ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onError={() => handleImageError(product._id)}
                                />
                            ) : (
                                <div className="product-image-placeholder">{product.name?.charAt(0)?.toUpperCase()}</div>
                            )}
                            <div className="product-card-body">
                                <span className="product-category">{product.category}</span>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <div className="product-meta">
                                    <strong>${Number(product.price).toFixed(2)}</strong>
                                    <span>{product.stock} in stock</span>
                                </div>
                                <div className="product-actions">
                                    <button type="button" onClick={() => handleEdit(product)}>Edit</button>
                                    <button className="delete-button" type="button" onClick={() => handleDelete(product._id)}>Delete</button>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}

export default ProductComponent;
