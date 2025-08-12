import { use, useState } from "react";
import "./App.css";
import Masonry from "react-masonry-css";
import { useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [openNoteId, setOpenNoteId] = useState(null);
  const backendUrl = "http://localhost:3001";

  const handleSaveNote = async (id, note) => {
    if (!id) return;
    try {
      setSavingNoteId(id);
      const res = await fetch(`${backendUrl}/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error("Failed to save note");

      //update local items
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, note } : item))
      );
      if (modalItem && modalItem.id === id) {
        setModalItem((m) => (m ? { ...m, note } : m));
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setSavingNoteId(null);
    }
  };

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

  useEffect(() => {
    fetchAllItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
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
                  {/*img and overlay*/}
                  <div className="relative mb-2 w-full">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full object-cover rounded"
                      style={{ display: "block" }}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none rounded"></div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.url.length > 40
                      ? `${item.url.slice(0, 40)}...`
                      : item.url}
                  </a>

                  {/* item notes */}
                  <div className="mt-3 w-full">
                    {openNoteId !== item.id ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenNoteId(item.id);
                        }}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                      >
                        Note
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2 ">
                        <textarea
                          className="w-full text-sm border rounded p-2 outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="Add a note..."
                          value={item.note || ""}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setItems((prev) =>
                              prev.map((it) =>
                                it.id === item.id
                                  ? { ...it, note: e.target.value }
                                  : it
                              )
                            )
                          }
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveNote(item.id, item.note);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            disabled={savingNoteId === item.id}
                          >
                            {savingNoteId === item.id
                              ? "Saving..."
                              : "Save Note"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenNoteId(null);
                            }}
                          >
                            Close Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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

              {/* Note section */}
              <div className="mb-2">
                <span className="block text-xs text-gray-500 mb-1">Note</span>
                <textarea
                  className="w-full text-sm border rounded p-2 outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Add a note..."
                  value={modalItem.note || ""}
                  onChange={(e) =>
                    setModalItem((prev) =>
                      prev ? { ...prev, note: e.target.value } : prev
                    )
                  }
                  rows={4}
                />
                <button
                  onClick={() => handleSaveNote(modalItem.id, modalItem.note)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                  disabled={savingNoteId === modalItem.id}
                >
                  {savingNoteId === modalItem.id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
