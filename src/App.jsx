import { useState } from "react";
import "./App.css";
import Masonry from "react-masonry-css";

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const backendUrl = "http://192.168.1.4:3001";

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${backendUrl}/preview?url=${encodeURIComponent(input.trim())}`
      );
      const data = await res.json();
      setItems([data, ...items]);
      setInput("");
    } catch (error) {
      console.error("Error fetching data:", error);
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
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 break-words min-h-[100px] flex-col items-center justify-center text-lg font-medium"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="mb-2 w-full h-40 object-cover rounded"
                />
              )}
              <div className="font-bold text-base mb-1">{item.title}</div>
              <div className="text-sm text-gray-600 mb-2">
                {item.description}
              </div>
              <a
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-xs"
              >
                {item.source}
              </a>
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
}

export default App;
