// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../api/events"; // dedicated events API
//  // axios instance with baseURL

// export default function Events() {
//   const [events, setEvents] = useState([]);
//   const [recentlyDeleted, setRecentlyDeleted] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [showDeleted, setShowDeleted] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   const [confirmPopup, setConfirmPopup] = useState({
//     show: false,
//     message: "",
//     onConfirm: null,
//   });

//   const [newEvent, setNewEvent] = useState({
//     title: "",
//     description: "",
//     date: "",
//     file: null,
//   });

//   // Fetch events on mount
//   useEffect(() => {
//     fetchEvents();
//     fetchDeletedEvents();
//   }, []);

//   const fetchEvents = async () => {
//     const res = await api.get("/");
//     setEvents(res.data);
//   };

//   const fetchDeletedEvents = async () => {
//     const res = await api.get("/deleted");
//     setRecentlyDeleted(res.data);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEvent((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0] ?? null;
//     setNewEvent((prev) => ({ ...prev, file }));
//   };

//   const handleAddEvent = async () => {
//     if (!newEvent.title || !newEvent.date) {
//       alert("Please provide title and date");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", newEvent.title);
//     formData.append("description", newEvent.description);
//     formData.append("date", newEvent.date);
//     if (newEvent.file) formData.append("file", newEvent.file);

//     const res = await api.post("/", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     setEvents((prev) => [res.data, ...prev]);
//     setNewEvent({ title: "", description: "", date: "", file: null });
//     setShowForm(false);
//   };

//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const confirmDelete = (message, onConfirm) => {
//     setConfirmPopup({ show: true, message, onConfirm });
//   };

//   const handleDeleteSingle = (id) => {
//     confirmDelete("Are you sure you want to delete this event?", async () => {
//       await api.patch(`/delete/${id}`);
//       fetchEvents();
//       fetchDeletedEvents();
//       setSelected((prev) => prev.filter((x) => x !== id));
//     });
//   };

//   const handleDeleteSelected = () => {
//     confirmDelete(`Delete ${selected.length} selected event(s)?`, async () => {
//       await Promise.all(selected.map((id) => api.patch(`/delete/${id}`)));
//       fetchEvents();
//       fetchDeletedEvents();
//       setSelected([]);
//     });
//   };

//   const handleRestore = async (id) => {
//     await api.patch(`/restore/${id}`);
//     fetchEvents();
//     fetchDeletedEvents();
//   };

//   const handlePermanentDelete = (id) => {
//     confirmDelete(
//       "Permanently delete this event? This cannot be undone.",
//       async () => {
//         await api.delete(`/${id}`);
//         fetchDeletedEvents();
//       }
//     );
//   };

//   return (
//     <section className="bg-white text-gray-800 min-h-screen py-10 px-4 relative">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-semibold text-slate-800 mb-1">
//               School Events & Circulars
//             </h1>
//             <p className="text-slate-500 text-sm">
//               Add, view, and manage all school events easily.
//             </p>
//           </div>
//           <div className="flex gap-3 mt-4 sm:mt-0">
//             {selected.length > 0 && (
//               <button
//                 onClick={handleDeleteSelected}
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
//               >
//                 🗑 Delete ({selected.length})
//               </button>
//             )}
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow transition"
//             >
//                Add Event
//             </button>
//             <button
//               onClick={() => setShowDeleted((s) => !s)}
//               className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow transition"
//             >
//                {showDeleted ? "Hide" : "Recently Deleted"}
//             </button>
//           </div>
//         </div>

//         {/* Event Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {events.length === 0 && (
//             <div className="col-span-full text-center text-slate-500 py-8">
//               No events yet — click “Add Event” to create one.
//             </div>
//           )}

//           {events.map((ev) => {
//             const isImage = ev.fileType === "image";
//             const isPdf = ev.fileType === "application" || ev.fileType === "pdf";

//             return (
//               <div
//                 key={ev._id}
//                 className={`relative bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer ${
//                   selected.includes(ev._id) ? "ring-4 ring-sky-500" : ""
//                 }`}
//                 onClick={() => toggleSelect(ev._id)}
//               >
//                 <div className="h-40 bg-gray-100 relative">
//                   {isImage && ev.filePath ? (
//                     <img
//                       src={`https://jr-school-67nt.onrender.com${ev.filePath}`}
//                       alt={ev.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : isPdf && ev.filePath ? (
//                     <div className="flex items-center justify-center w-full h-full bg-gray-200 text-xs text-slate-600">
//                       PDF / Document
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center w-full h-full text-slate-400 text-sm">
//                       No file
//                     </div>
//                   )}
//                 </div>
//                 <div className="p-3">
//                   <h3 className="text-sm font-semibold text-slate-900 truncate mb-1">
//                     {ev.title}
//                   </h3>
//                   <p className="text-xs text-slate-500 mb-1">
//                     {new Date(ev.date).toDateString()}
//                   </p>
//                   <p className="text-xs text-slate-600 line-clamp-2 mb-1">
//                     {ev.description || "—"}
//                   </p>
//                 </div>

//                 {/* <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteSingle(ev._id);
//                   }}
//                   className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition"
//                 >
//                   ✖
//                 </button> */}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Add Form */}
//       <AnimatePresence>
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             transition={{ duration: 0.25 }}
//             className="fixed bottom-10 right-10 bg-white border border-slate-300 p-5 shadow-2xl rounded-xl w-80 z-50"
//           >
//             <h2 className="text-lg font-semibold mb-3 text-slate-800">
//               Add New Event
//             </h2>
//             <input
//               type="text"
//               name="title"
//               value={newEvent.title}
//               onChange={handleInputChange}
//               placeholder="Title"
//               className="w-full border border-slate-300 px-2 py-1 mb-2 rounded"
//             />
//             <input
//               type="date"
//               name="date"
//               value={newEvent.date}
//               onChange={handleInputChange}
//               className="w-full border border-slate-300 px-2 py-1 mb-2 rounded"
//             />
//             <textarea
//               name="description"
//               value={newEvent.description}
//               onChange={handleInputChange}
//               placeholder="Description"
//               className="w-full border border-slate-300 px-2 py-1 mb-2 rounded"
//             />
//             <input
//               type="file"
//               accept="image/*,.pdf"
//               onChange={handleFileChange}
//               className="w-full border border-slate-300 px-2 py-1 mb-3 rounded"
//             />
//             <div className="flex justify-between">
//               <button
//                 onClick={handleAddEvent}
//                 className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
//               >
//                 Upload
//               </button>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100"
//               >
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Recently Deleted */}
//       <AnimatePresence>
//         {showDeleted && recentlyDeleted.length > 0 && (
//           <motion.div
//             initial={{ y: 100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: 100, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed bottom-0 left-0 right-0 bg-slate-100 border-t border-slate-300 py-3 px-4 shadow-lg overflow-x-auto flex gap-3"
//           >
//             {recentlyDeleted.map((ev) => (
//               <div key={ev._id} className="relative flex-shrink-0 w-28 h-20">
//                 {ev.filePath && ev.fileType === "image" ? (
//                   <img
//                     src={`https://jr-school-67nt.onrender.com${ev.filePath}`}
//                     alt={ev.title}
//                     className="w-full h-full object-cover border"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
//                     PDF / No File
//                   </div>
//                 )}
//                 <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition text-xs text-white">
//                   <button
//                     onClick={() => handleRestore(ev._id)}
//                     className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded mb-1"
//                   >
//                     ♻ Restore
//                   </button>
//                   <button
//                     onClick={() => handlePermanentDelete(ev._id)}
//                     className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
//                   >
//                     🗑 Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Confirmation Popup */}
//       <AnimatePresence>
//         {confirmPopup.show && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white p-6 rounded-xl shadow-xl w-80 text-center"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                 Confirm Deletion
//               </h3>
//               <p className="text-slate-600 mb-4">{confirmPopup.message}</p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => {
//                     confirmPopup.onConfirm();
//                     setConfirmPopup({ show: false, message: "", onConfirm: null });
//                   }}
//                   className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                 >
//                   Yes, Delete
//                 </button>
//                 <button
//                   onClick={() =>
//                     setConfirmPopup({ show: false, message: "", onConfirm: null })
//                   }
//                   className="border border-slate-300 px-4 py-2 rounded hover:bg-slate-100"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// }




import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllEvents,
  createEvent,
  deleteEvent,
  getDeletedEvents,
  restoreEvent,
  permanentDeleteEvent,
} from "../api/events.js";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    file: null,
  });

  useEffect(() => {
    fetchEvents();
    fetchDeletedEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await getAllEvents();
    setEvents(res.data);
  };

  const fetchDeletedEvents = async () => {
    const res = await getDeletedEvents();
    setRecentlyDeleted(res.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setNewEvent((prev) => ({ ...prev, file }));
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Please provide title and date");
      return;
    }

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description);
    formData.append("date", newEvent.date);
    if (newEvent.file) formData.append("file", newEvent.file);

    const res = await createEvent(formData);
    setEvents((prev) => [res.data, ...prev]);
    setNewEvent({ title: "", description: "", date: "", file: null });
    setShowForm(false);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const confirmDelete = (message, onConfirm) => {
    setConfirmPopup({ show: true, message, onConfirm });
  };

  const handleDeleteSingle = (id) => {
    confirmDelete("Are you sure you want to delete this event?", async () => {
      await deleteEvent(id);
      fetchEvents();
      fetchDeletedEvents();
      setSelected((prev) => prev.filter((x) => x !== id));
    });
  };

  const handleDeleteSelected = () => {
    confirmDelete(`Delete ${selected.length} selected event(s)?`, async () => {
      await Promise.all(selected.map((id) => deleteEvent(id)));
      fetchEvents();
      fetchDeletedEvents();
      setSelected([]);
    });
  };

  const handleRestore = async (id) => {
    await restoreEvent(id);
    fetchEvents();
    fetchDeletedEvents();
  };

  const handlePermanentDelete = (id) => {
    confirmDelete(
      "Permanently delete this event? This cannot be undone.",
      async () => {
        await permanentDeleteEvent(id);
        fetchDeletedEvents();
      }
    );
  };

  return (
    <section className="bg-white text-dark min-vh-100 py-5 px-3 position-relative">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-semibold text-dark mb-1">
              🎉 School Events & Circulars
            </h1>
            <p className="text-secondary small mb-0">
              Manage, view, delete and restore school events with ease.
            </p>
          </div>
          <div className="d-flex gap-2 mt-3 mt-sm-0">
            {selected.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteSelected}
                className="btn btn-danger shadow-sm px-3"
              >
                🗑 Delete ({selected.length})
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="btn btn-primary shadow-sm px-3"
            >
              ➕ Add Event
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleted((s) => !s)}
              className="btn btn-dark shadow-sm px-3"
            >
              {showDeleted ? "Hide Deleted" : "🗂 Recently Deleted"}
            </motion.button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="row g-4">
          {events.length === 0 && (
            <div className="text-center text-secondary py-5">
              No events yet — click “Add Event” to create one.
            </div>
          )}

          {events.map((ev) => {
            const isImage = ev.fileType === "image";
            const isPdf =
              ev.fileType === "application" || ev.fileType === "pdf";

            return (
              <motion.div
                key={ev._id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <div
                  className={`card h-100 shadow-sm border-0 rounded-3 overflow-hidden position-relative ${
                    selected.includes(ev._id)
                      ? "border-primary border-3"
                      : "border-light"
                  }`}
                  onClick={() => toggleSelect(ev._id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="position-relative">
                    <div
                      className="bg-light"
                      style={{ height: 180, overflow: "hidden" }}
                    >
                      {isImage && ev.filePath ? (
                        <img
                          src={`https://jr-school-67nt.onrender.com${ev.filePath}`}
                          alt={ev.title}
                          className="w-100 h-100 object-fit-cover"
                        />
                      ) : isPdf && ev.filePath ? (
                        <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                          PDF / Document
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                          No file
                        </div>
                      )}
                    </div>

                    {/* Overlay delete icon */}
                    <div className="position-absolute top-0 end-0 p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSingle(ev._id);
                        }}
                        className="btn btn-sm btn-outline-danger rounded-circle shadow-sm"
                        title="Delete Event"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  <div className="card-body">
                    <h6 className="fw-semibold text-truncate mb-1">
                      {ev.title}
                    </h6>
                    <small className="text-muted d-block mb-1">
                      {new Date(ev.date).toDateString()}
                    </small>
                    <p className="text-secondary small mb-0">
                      {ev.description || "—"}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="position-fixed bottom-0 end-0 m-4 bg-white border rounded shadow-lg p-4"
            style={{ width: "22rem", zIndex: 1050 }}
          >
            <h5 className="fw-semibold mb-3 text-dark">Add New Event</h5>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="form-control mb-2"
            />
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="form-control mb-2"
              rows="3"
            />
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="form-control mb-3"
            />
            <div className="d-flex justify-content-between">
              <button
                onClick={handleAddEvent}
                className="btn btn-primary px-3 py-1"
              >
                Upload
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="btn btn-outline-secondary px-3 py-1"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently Deleted */}
      <AnimatePresence>
        {showDeleted && recentlyDeleted.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="position-fixed bottom-0 start-0 end-0 bg-light border-top shadow-lg p-3 overflow-auto"
            style={{ zIndex: 1040, whiteSpace: "nowrap" }}
          >
            <div className="fw-semibold text-dark mb-2 ms-2">
              ♻ Recently Deleted Events
            </div>
            {recentlyDeleted.map((ev) => (
              <motion.div
                key={ev._id}
                whileHover={{ scale: 1.05 }}
                className="d-inline-block position-relative me-3 rounded overflow-hidden shadow-sm bg-white"
                style={{ width: 120, height: 90 }}
              >
                {ev.filePath && ev.fileType === "image" ? (
                  <img
                    src={`https://jr-school-67nt.onrender.com${ev.filePath}`}
                    alt={ev.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <div className="w-100 h-100 bg-secondary-subtle d-flex align-items-center justify-content-center text-muted small">
                    PDF / No File
                  </div>
                )}

                {/* Overlay restore/delete buttons */}
                <motion.div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center gap-2 bg-dark bg-opacity-50 text-white"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <button
                    onClick={() => handleRestore(ev._id)}
                    className="btn btn-success btn-sm px-3"
                  >
                    ♻ Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(ev._id)}
                    className="btn btn-danger btn-sm px-3"
                  >
                    🗑 Delete
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Popup */}
      <AnimatePresence>
        {confirmPopup.show && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 2000 }}
          >
            <motion.div
              className="bg-white p-4 rounded shadow text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: "20rem" }}
            >
              <h5 className="fw-semibold text-dark mb-2">Confirm Action</h5>
              <p className="text-secondary mb-4">{confirmPopup.message}</p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  onClick={() => {
                    confirmPopup.onConfirm();
                    setConfirmPopup({ show: false, message: "", onConfirm: null });
                  }}
                  className="btn btn-danger px-3"
                >
                  Yes, Proceed
                </button>
                <button
                  onClick={() =>
                    setConfirmPopup({ show: false, message: "", onConfirm: null })
                  }
                  className="btn btn-outline-secondary px-3"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
