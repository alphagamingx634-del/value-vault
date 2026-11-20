import { useEffect, useState } from "react";
import API from "../api/axios";

function Products({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      setProducts([]);

      try {
        const response = await API.get(
          `/products?category=${encodeURIComponent(category)}`
        );

        setProducts(response.data.products);
      } catch (error) {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleBorrow = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/borrow", {
        productId: selectedProduct._id,
        startDate,
        endDate,
      });

      setMessage(response.data.message);
      setSelectedProduct(null);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to submit borrowing request."
      );
    }
  };

  if (loading) return <h2>Loading products...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <section className="products-section" id="products">
      <h2>{category} Products</h2>

      {message && <p className="auth-message">{message}</p>}

      <div className="products-container">
        {products.length === 0 ? (
          <p>No products available in this category yet.</p>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product._id}>
  <img
    src={
      product.name === "Canon Camera"
        ? "/images/canon-camera.png"
        : product.name === "Canon Camera Updated"
        ? "/images/canon-camera-updated.png"
        : product.image
    }
    alt={product.name}
    className="product-image"
  />
  <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Category: {product.category}</p>
              <h4>₹{product.pricePerDay} / day</h4>

              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setMessage("");
                }}
              >
                Borrow Now
              </button>

              {selectedProduct?._id === product._id && (
                <form onSubmit={handleBorrow}>
                  <h4>Select Rental Dates</h4>

                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />

                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    required
                  />

                  <button type="submit">
                    Submit Borrow Request
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Products;