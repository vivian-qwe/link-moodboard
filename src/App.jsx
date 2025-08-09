import { useState } from "react";
import "./App.css";
import Masonry from "react-masonry-css";

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const backendUrl = "http://localhost:3001";

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    url: "",
    type: "link",
    source_url: "",
    note: "",
  });
  const [fetching, setFetching] = useState(false);

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/items`);
      const allItems = await res.json();
      setItems(allItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/items/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error("Error deleting item:", res.statusText);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: form.url,
          title: form.title,
          description: form.description,
          image_url: form.image_url,
          type: form.type,
          source_url: form.source_url,
          note: form.note,
        }),
      });
      const resData = await res.json();
      const newItem = Array.isArray(resData) ? resData[0] : resData;
      console.log("New item added:", newItem);
      setItems((prev) => [newItem, ...prev]);
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        image_url: "",
        url: "",
        type: "link",
        source_url: "",
        note: "",
      });
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async (e) => {
    setFetching(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/preview?url=${encodeURIComponent(form.url)}`
      );
      const preview = await res.json();
      console.log("Preview data:", preview);
      setForm((f) => ({
        ...f,
        title: preview.title || "",
        description: preview.description || "",
        image_url: preview.image_url || "",
        source_url: preview.source_url || "",
        url: preview.url || "",
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/preview?url=${encodeURIComponent(input.trim())}`
      );
      const preview = await res.json();

      //save to backend
      const saveRes = await fetch(`${backendUrl}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...preview,
          note: "",
          type: "link",
        }),
      });
      const savedItem = await saveRes.json();
      setItems([savedItem, ...items]);
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  // Masonry breakpoint columns
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      {showModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <form onSubmit={handleFormAdd}>
              <div className="mb-2">
                <label>Link</label>
                <div className="flex gap-2">
                  <input
                    value={form.url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, url: e.target.value }))
                    }
                    className="border px-2 py-1 flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleFetch}
                    disabled={fetching || !form.url}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    {fetching ? "Fetching..." : "Fetch"}
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <label>Title</label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="border px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="border px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Image URL</label>
                <input
                  value={form.image_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image_url: e.target.value }))
                  }
                  className="border px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Note</label>
                <input
                  value={form.note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, note: e.target.value }))
                  }
                  className="border px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Type</label>
                <input
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                  className="border px-2 py-1 w-full"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <button onClick={() => setShowModal(true)}>Add Item</button>
      <form
        onSubmit={handleAdd}
        className="flex gap-2 mb-8 w-full max-w-3xl mx-auto"
      >
        <input
          className="border rounded px-3 py-2 flex-1 w-full"
          type="text"
          placeholder="Add..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded text-xl"
          type="submit"
          disabled={loading}
        >
          +
        </button>
      </form>
      <div className="w-screen -mx-8 px-8">
        <button
          onClick={fetchAllItems}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Loading..." : "Refresh Items"}
        </button>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map(
            (item, index) =>
              item && (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 break-words min-h-[100px] flex-col items-center justify-center text-lg font-medium relative group"
                  onClick={() => setModalItem(item)}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="mb-2 w-full h-40 object-cover rounded"
                    />
                  )}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ zIndex: 10 }}
                  >
                    Delete
                  </button>
                  <div className="font-bold text-base mb-1">{item.title}</div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-xs"
                    title={item.url}
                  >
                    {item.url.length > 40
                      ? `${item.url.slice(0, 40)}...`
                      : item.url}
                  </a>
                </div>
              )
          )}
        </Masonry>

        {/* Modal for item details */}
        {modalItem && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setModalItem(null)}
          >
            <div
              className="bg-white rounded-lg max-w-lg w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalItem(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>

              {modalItem.image_url && (
                <img
                  src={modalItem.image_url}
                  alt={modalItem.title}
                  className="mb-4 w-full object-cover rounded"
                />
              )}
              <h2 className="text-lg font-bold mb-2">{modalItem.title}</h2>
              <hr className="my-2" />
              <div className="mb-4">
                <a
                  href={modalItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm break-all"
                >
                  {modalItem.url}
                </a>
              </div>
              <hr className="my-2" />
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <p className="text-sm text-gray-700">{modalItem.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
