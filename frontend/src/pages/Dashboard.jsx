
import { useEffect, useState } from "react";
import API from "../api/axios";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [myProducts, setMyProducts] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product form states
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [image, setImage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const currentUserId = currentUser?.id || currentUser?._id;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [productsResponse, requestsResponse] = await Promise.all([
        API.get("/products/my"),
        API.get("/borrow/my"),
      ]);

      setMyProducts(productsResponse.data.products || []);
      setBorrowRequests(requestsResponse.data.requests || []);
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter borrowing activities
  const borrowedItems = borrowRequests.filter(
    (request) =>
      (request.borrower?._id || request.borrower) === currentUserId
  );

  const receivedRequests = borrowRequests.filter(
    (request) =>
      (request.owner?._id || request.owner) === currentUserId
  );

  const rentalHistory = borrowRequests.filter(
    (request) =>
      (request.borrower?._id || request.borrower) === currentUserId &&
      request.status === "returned"
  );

  // Approve or reject borrow request
  const handleRequestAction = async (requestId, status) => {
    try {
      await API.put(`/borrow/${requestId}`, { status });

      const response = await API.get("/borrow/my");
      setBorrowRequests(response.data.requests || []);
    } catch (error) {
      console.error(
        "Request update error:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductMessage("");

    try {
      setAddingProduct(true);

      await API.post("/products", {
        name: productName,
        description,
        category,
        pricePerDay: Number(pricePerDay),
        image: image || undefined,
      });

      setProductMessage("Product added successfully!");

      setProductName("");
      setDescription("");
      setCategory("");
      setPricePerDay("");
      setImage("");

      await fetchDashboardData();
      setActiveTab("products");
    } catch (error) {
      setProductMessage(
        error.response?.data?.message ||
        "Unable to add product. Please try again."
      );
    } finally {
      setAddingProduct(false);
    }
  };

  // Dashboard menu
  const menuItems = [
    { id: "overview", label: "Overview" },
    { id: "add", label: "Add Product" },
    { id: "products", label: "My Products" },
    { id: "borrowed", label: "Borrowed Items" },
    { id: "requests", label: "Borrow Requests" },
    { id: "history", label: "Rental History" },
  ];

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <h2>Value Vault</h2>
        <h3>Dashboard</h3>

        {menuItems.map((item) => (
          <button
            key={item.id}
            className={activeTab === item.id ? "active-tab" : ""}
            onClick={() => {
              setActiveTab(item.id);
              setProductMessage("");
            }}
          >
            {item.label}
          </button>
        ))}
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Welcome to Your Dashboard!</h1>
            <p>Manage your borrowing and rental activities.</p>
          </div>
        </header>

        {/* Overview */}
        {activeTab === "overview" && (
          <section>
            <h2>Overview</h2>

            {loading ? (
              <p>Loading dashboard...</p>
            ) : (
              <div className="dashboard-cards">
                <div className="dashboard-card">
                  <h3>My Products</h3>
                  <h2>{myProducts.length}</h2>
                  <p>Products listed by you</p>
                </div>

                <div className="dashboard-card">
                  <h3>Borrowed Items</h3>
                  <h2>{borrowedItems.length}</h2>
                  <p>Items requested by you</p>
                </div>

                <div className="dashboard-card">
                  <h3>Requests Received</h3>
                  <h2>{receivedRequests.length}</h2>
                  <p>Requests for your products</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Add Product */}
        {activeTab === "add" && (
          <section className="dashboard-content">
            <h2>Add New Product</h2>
            <p>List an item that other people can rent from you.</p>

            {productMessage && (
              <p className="auth-message">{productMessage}</p>
            )}

            <form onSubmit={handleAddProduct} className="auth-form">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                placeholder="Describe your product"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Tools">Tools</option>
                <option value="Sports">Sports</option>
                <option value="Furniture">Furniture</option>
                <option value="Music">Music</option>
                <option value="Vehicles">Vehicles</option>
                
              </select>

              <label>Rental Price Per Day (₹)</label>
              <input
                type="number"
                placeholder="Enter daily rental price"
                min="1"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
              />

              <label>Product Image URL (Optional)</label>
              <input
                type="url"
                placeholder="Paste an image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <button type="submit" disabled={addingProduct}>
                {addingProduct ? "Adding Product..." : "Publish Product"}
              </button>
            </form>
          </section>
        )}

        {/* My Products */}
        {activeTab === "products" && (
          <section className="dashboard-content">
            <h2>My Products</h2>

            {loading ? (
              <p>Loading products...</p>
            ) : myProducts.length === 0 ? (
              <p>You haven't listed any products yet.</p>
            ) : (
              <div className="dashboard-cards">
                {myProducts.map((product) => (
                  <div className="dashboard-card" key={product._id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <h4>₹{product.pricePerDay} / day</h4>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Borrowed Items */}
        {activeTab === "borrowed" && (
          <section className="dashboard-content">
            <h2>Borrowed Items</h2>

            {loading ? (
              <p>Loading borrowed items...</p>
            ) : borrowedItems.length === 0 ? (
              <p>You haven't requested any products yet.</p>
            ) : (
              <div className="dashboard-cards">
                {borrowedItems.map((request) => (
                  <div className="dashboard-card" key={request._id}>
                    <h3>{request.product?.name || "Product unavailable"}</h3>
                    <p>Status: {request.status}</p>
                    <p>Start Date: {new Date(request.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(request.endDate).toLocaleDateString()}</p>
                    <p>Rental Days: {request.rentalDays}</p>
                    <h4>Total: ₹{request.totalPrice}</h4>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Borrow Requests */}
        {activeTab === "requests" && (
          <section className="dashboard-content">
            <h2>Borrow Requests</h2>

            {loading ? (
              <p>Loading requests...</p>
            ) : receivedRequests.length === 0 ? (
              <p>You haven't received any borrowing requests.</p>
            ) : (
              <div className="dashboard-cards">
                {receivedRequests.map((request) => (
                  <div className="dashboard-card" key={request._id}>
                    <h3>{request.product?.name || "Product unavailable"}</h3>
                    <p>Borrower: {request.borrower?.name || "Unknown"}</p>
                    <p>Status: {request.status}</p>
                    <p>Start Date: {new Date(request.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(request.endDate).toLocaleDateString()}</p>
                    <p>Rental Days: {request.rentalDays}</p>
                    <h4>Total: ₹{request.totalPrice}</h4>

                    {request.status === "pending" && (
                      <div className="request-actions">
                        <button
                          onClick={() =>
                            handleRequestAction(request._id, "approved")
                          }
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleRequestAction(request._id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Rental History */}
        {activeTab === "history" && (
          <section className="dashboard-content">
            <h2>Rental History</h2>

            {loading ? (
              <p>Loading rental history...</p>
            ) : rentalHistory.length === 0 ? (
              <p>No completed rentals found.</p>
            ) : (
              <div className="dashboard-cards">
                {rentalHistory.map((request) => (
                  <div className="dashboard-card" key={request._id}>
                    <h3>{request.product?.name || "Product unavailable"}</h3>
                    <p>Status: Returned</p>
                    <p>Start Date: {new Date(request.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(request.endDate).toLocaleDateString()}</p>
                    <p>Rental Days: {request.rentalDays}</p>
                    <h4>Total: ₹{request.totalPrice}</h4>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
