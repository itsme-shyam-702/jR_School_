import { useEffect, useState } from "react";
import api from "../api/contact";
import { MoreVertical, FolderMinus, Trash2, ArrowLeft } from "lucide-react";

function InboxDashboard() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.getMessages();
        const msgs = res.data.map((m) => ({
          ...m,
          read: JSON.parse(localStorage.getItem(`read-${m._id}`)) || false,
          deleted: m.deleted || false,
          new: !JSON.parse(localStorage.getItem(`read-${m._id}`)),
        }));

        msgs.sort((a, b) => {
          if (a.read === b.read) return new Date(b.createdAt) - new Date(a.createdAt);
          return a.read ? 1 : -1;
        });

        setMessages(msgs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const openMessage = (msg) => {
    if (multiSelectMode) {
      toggleSelect(msg._id);
      return;
    }
    if (showTrash) return;
    setSelectedMessage(msg);
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msg._id ? { ...m, read: true, new: false } : m
      )
    );
    localStorage.setItem(`read-${msg._id}`, true);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSingle = async () => {
    if (!selectedMessage) return;
    try {
      await api.softDeleteMessage(selectedMessage._id);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === selectedMessage._id ? { ...m, deleted: true } : m
        )
      );
      setSelectedMessage(null);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const restoreSingle = async (id) => {
    try {
      await api.restoreMessage(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, deleted: false } : m))
      );
    } catch (err) {
      console.error("Failed to restore message:", err);
    }
  };

  const permanentDelete = async (id) => {
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (err) {
      console.error("Failed to permanently delete message:", err);
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedIds.map((id) => api.softDeleteMessage(id)));
      setMessages((prev) =>
        prev.map((m) => (selectedIds.includes(m._id) ? { ...m, deleted: true } : m))
      );
      setSelectedIds([]);
      setMultiSelectMode(false);
      setShowMenu(false);
      if (selectedMessage && selectedIds.includes(selectedMessage._id))
        setSelectedMessage(null);
    } catch (err) {
      console.error("Failed to delete selected messages:", err);
    }
  };

  const restoreSelected = async () => {
    try {
      await Promise.all(selectedIds.map((id) => api.restoreMessage(id)));
      setMessages((prev) =>
        prev.map((m) => (selectedIds.includes(m._id) ? { ...m, deleted: false } : m))
      );
      setSelectedIds([]);
      setMultiSelectMode(false);
      setShowMenu(false);
    } catch (err) {
      console.error("Failed to restore selected messages:", err);
    }
  };

  const visibleMessages = messages.filter((m) => (showTrash ? m.deleted : !m.deleted));
  const unreadCount = messages.filter((m) => !m.read && !m.deleted).length;
  const readCount = messages.filter((m) => m.read && !m.deleted).length;
  const deletedCount = messages.filter((m) => m.deleted).length;

  return (
    <div className="flex h-[85vh] max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-gray-50 flex flex-col">
        {/* Top toolbar */}
        <div className="p-4 border-b bg-gray-100 flex justify-around items-center">
          {/* Trash icon */}
          <div
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => {
              setShowTrash(true);
              setMultiSelectMode(false);
            }}
          >
            <FolderMinus className="w-6 h-6 text-red-600 hover:text-red-700" />
            {deletedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {deletedCount}
              </span>
            )}
            <span className="text-xs text-gray-700 mt-1">Trash</span>
          </div>

          {/* Delete single message */}
          <div
            className="relative flex flex-col items-center cursor-pointer"
            onClick={deleteSingle}
          >
            <Trash2 className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            {selectedMessage && !showTrash && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            )}
            <span className="text-xs text-gray-700 mt-1">Delete</span>
          </div>

          {/* Multi-select menu */}
          <div className="relative flex flex-col items-center">
            <button onClick={() => setShowMenu((prev) => !prev)}>
              <MoreVertical className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            </button>
            {showMenu && (
              <div className="absolute top-7 right-0 bg-white border shadow-lg rounded-md z-50 flex flex-col w-44">
                <button
                  className="px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setMultiSelectMode((prev) => !prev);
                    setShowMenu(false);
                  }}
                >
                  {multiSelectMode ? "Cancel Multi-select" : "Multi-select"}
                </button>
                {multiSelectMode && !showTrash && (
                  <button
                    className={`px-4 py-2 text-left hover:bg-gray-100 ${
                      selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (selectedIds.length > 0) deleteSelected();
                      setShowMenu(false);
                    }}
                  >
                    Delete Selected
                  </button>
                )}
                {multiSelectMode && showTrash && (
                  <button
                    className={`px-4 py-2 text-left hover:bg-gray-100 ${
                      selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (selectedIds.length > 0) restoreSelected();
                      setShowMenu(false);
                    }}
                  >
                    Restore Selected
                  </button>
                )}
              </div>
            )}
            {multiSelectMode && selectedIds.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {selectedIds.length}
              </span>
            )}
          </div>

          {/* Read/Unread counts */}
          <div className="flex flex-col items-center relative">
            <span className="text-xs text-gray-700 mt-1">Read/Unread</span>
            {unreadCount + readCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}/{readCount}
              </span>
            )}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading messages...</div>
          ) : visibleMessages.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              {showTrash ? "Trash is empty" : "No messages"}
            </div>
          ) : (
            visibleMessages.map((msg) => (
              <div
                key={msg._id}
                className={`flex justify-between items-center p-4 cursor-pointer border-b hover:bg-gray-100 rounded-lg mx-2 my-1 ${
                  msg.read ? "bg-green-50" : "bg-red-50"
                } ${selectedIds.includes(msg._id) ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => openMessage(msg)}
              >
                <div className="flex flex-col">
                  <p className="font-semibold">{msg.name}</p>
                  <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {!showTrash && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        msg.read ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {msg.read ? "Read" : "Unread"}
                    </span>
                  )}
                  {multiSelectMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(msg._id)}
                      onChange={() => toggleSelect(msg._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {showTrash && (
                    <div className="flex space-x-1">
                      <button
                        className="text-green-600 hover:text-green-800 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreSingle(msg._id);
                        }}
                      >
                        Restore
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          permanentDelete(msg._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Message Viewer */}
      {selectedMessage && !showTrash && (
        <div className="w-2/3 p-6 bg-white overflow-y-auto">
          <button
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
            onClick={() => setSelectedMessage(null)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Back
          </button>
          <h2 className="text-xl font-semibold">{selectedMessage.name}</h2>
          <p className="text-gray-600">{selectedMessage.email}</p>
          <p className="mt-4 whitespace-pre-wrap">{selectedMessage.message}</p>
        </div>
      )}
    </div>
  );
}

export default InboxDashboard;
