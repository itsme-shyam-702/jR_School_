// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../api/gallery";

// export default function Gallery() {
//   const [images, setImages] = useState([]);
//   const [recentlyDeleted, setRecentlyDeleted] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [showDeleted, setShowDeleted] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   const [newImage, setNewImage] = useState({
//     file: null,
//     title: "",
//     description: "",
//   });

//   // Fetch all images and deleted images on mount
//   useEffect(() => {
//     fetchImages();
//     fetchDeletedImages();
//   }, []);

//   const fetchImages = async () => {
//     const res = await api.getAll();
//     setImages(res.data);
//   };

//   const fetchDeletedImages = async () => {
//     const res = await api.getDeleted();
//     setRecentlyDeleted(res.data);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewImage((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0] ?? null;
//     setNewImage((prev) => ({ ...prev, file }));
//   };

//   const handleAddImage = async () => {
//     if (!newImage.file) {
//       alert("Please select an image file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", newImage.file);
//     formData.append("title", newImage.title || "Untitled");
//     formData.append("description", newImage.description || "");

//     const res = await api.add(formData);
//     setImages((prev) => [res.data, ...prev]);
//     setNewImage({ file: null, title: "", description: "" });
//     setShowForm(false);
//     document.getElementById("fileInput").value = "";
//   };

//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleDeleteSingle = async (id) => {
//     await api.softDelete(id);
//     fetchImages();
//     fetchDeletedImages();
//     setSelected((prev) => prev.filter((x) => x !== id));
//   };

//   const handleDeleteSelected = async () => {
//     await Promise.all(selected.map((id) => api.softDelete(id)));
//     fetchImages();
//     fetchDeletedImages();
//     setSelected([]);
//   };

//   const handleRestore = async (id) => {
//     await api.restore(id);
//     fetchImages();
//     fetchDeletedImages();
//   };

//   const handlePermanentDelete = async (id) => {
//     await api.permanentDelete(id);
//     fetchDeletedImages();
//   };

//   return (
//     <section className="bg-white text-gray-800 min-h-screen py-10 px-4 relative">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-semibold text-slate-800 mb-1">
//               School Gallery
//             </h1>
//             <p className="text-slate-500 text-sm">
//               View, add, and manage school images easily
//             </p>
//           </div>
//           <div className="flex gap-3 mt-4 sm:mt-0">
//             {selected.length > 0 && (
//               <button
//                 onClick={handleDeleteSelected}
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
//               >
//                  Delete ({selected.length})
//               </button>
//             )}
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow transition"
//             >
//                Add Image
//             </button>
//             <button
//               onClick={() => setShowDeleted((s) => !s)}
//               className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow transition"
//             >
//                {showDeleted ? "Hide" : "Recently Deleted"}
//             </button>
//           </div>
//         </div>

//         {/* Masonry Gallery */}
//         <div
//           className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-1 space-y-1"
//           style={{ columnFill: "balance" }}
//         >
//           {images.map((img) => (
//             <div
//               key={img._id}
//               className={`relative overflow-hidden hover:opacity-90 transition cursor-pointer break-inside-avoid ${
//                 selected.includes(img._id) ? "ring-4 ring-sky-500" : ""
//               }`}
//               onClick={() => toggleSelect(img._id)}
//             >
//               <img
//                 src={`https://jr-school-67nt.onrender.com${img.filePath}`}
//                 alt={img.title}
//                 className="w-full h-auto object-cover"
//               />
//               <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-1 text-xs">
//                 <p className="font-semibold">{img.title}</p>
//                 {img.description && <p className="opacity-90">{img.description}</p>}
//               </div>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteSingle(img._id);
//                 }}
//                 className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition"
//               >
//                 ✖
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Floating Add Form */}
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
//               Add New Image
//             </h2>
//             <input
//               id="fileInput"
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full border border-slate-300 px-2 py-1 mb-2 rounded"
//             />
//             <input
//               type="text"
//               name="title"
//               value={newImage.title}
//               onChange={handleInputChange}
//               placeholder="Title"
//               className="w-full border border-slate-300 px-2 py-1 mb-2 rounded"
//             />
//             <input
//               type="text"
//               name="description"
//               value={newImage.description}
//               onChange={handleInputChange}
//               placeholder="Description"
//               className="w-full border border-slate-300 px-2 py-1 mb-3 rounded"
//             />
//             <div className="flex justify-between">
//               <button
//                 onClick={handleAddImage}
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

//       {/* Recently Deleted Strip */}
//       <AnimatePresence>
//         {showDeleted && recentlyDeleted.length > 0 && (
//           <motion.div
//             initial={{ y: 100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: 100, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed bottom-0 left-0 right-0 bg-slate-100 border-t border-slate-300 py-3 px-4 shadow-lg overflow-x-auto flex gap-3"
//           >
//             {recentlyDeleted.map((img) => (
//               <div key={img._id} className="relative flex-shrink-0 w-28 h-20">
//                 <img
//                   src={`https://jr-school-67nt.onrender.com${img.filePath}`}
//                   alt={img.title}
//                   className="w-full h-full object-cover border"
//                 />
//                 <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition text-xs text-white">
//                   <button
//                     onClick={() => handleRestore(img._id)}
//                     className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded mb-1"
//                   >
//                     ♻ Restore
//                   </button>
//                   <button
//                     onClick={() => handlePermanentDelete(img._id)}
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
//     </section>
//   );
// }



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/gallery";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [newImage, setNewImage] = useState({
    file: null,
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchImages();
    fetchDeletedImages();
  }, []);

  const fetchImages = async () => {
    const res = await api.getAll();
    setImages(res.data);
  };

  const fetchDeletedImages = async () => {
    const res = await api.getDeleted();
    setRecentlyDeleted(res.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewImage((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setNewImage((prev) => ({ ...prev, file }));
  };

  const handleAddImage = async () => {
    if (!newImage.file) {
      alert("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", newImage.file);
    formData.append("title", newImage.title || "Untitled");
    formData.append("description", newImage.description || "");

    const res = await api.add(formData);
    setImages((prev) => [res.data, ...prev]);
    setNewImage({ file: null, title: "", description: "" });
    setShowForm(false);
    document.getElementById("fileInput").value = "";
  };

  const handleDeleteSingle = async (id) => {
    await api.softDelete(id);
    fetchImages();
    fetchDeletedImages();
  };

  const handleRestore = async (id) => {
    await api.restore(id);
    fetchImages();
    fetchDeletedImages();
  };

  const handlePermanentDelete = async (id) => {
    await api.permanentDelete(id);
    fetchDeletedImages();
  };

  return (
    <section className="bg-white text-dark min-vh-100 py-5 px-3 position-relative">
      <div className="container-lg">
        {/* Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-semibold text-dark mb-1">School Gallery</h1>
            <p className="text-muted small">
              View, add, and manage school images easily
            </p>
          </div>

          <div className="d-flex gap-2 mt-3 mt-sm-0">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary shadow-sm"
            >
              Add Image
            </button>
            <button
              onClick={() => setShowDeleted((s) => !s)}
              className="btn btn-secondary shadow-sm"
            >
              {showDeleted ? "Hide" : "Recently Deleted"}
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="row g-1">
          {images.map((img) => (
            <div
              key={img._id}
              className="col-6 col-sm-4 col-md-3 col-lg-2 position-relative"
              style={{ cursor: "pointer" }}
            >
              <div className="position-relative overflow-hidden rounded">
                <img
                  src={`https://jr-school-67nt.onrender.com${img.filePath}`}
                  alt={img.title}
                  className="img-fluid rounded"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                />
                {/* Title inside image (flat bar style) */}
                <div className="position-absolute bottom-0 start-0 end-0 bg-dark text-white px-2 py-1 small">
                  <div className="fw-semibold text-truncate">{img.title}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSingle(img._id);
                  }}
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
            className="position-fixed bottom-0 end-0 m-4 bg-white border p-4 shadow rounded-4"
            style={{ width: "22rem", zIndex: 1050 }}
          >
            <h5 className="fw-semibold mb-3">Add New Image</h5>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              name="title"
              value={newImage.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="form-control mb-2"
            />
            <input
              type="text"
              name="description"
              value={newImage.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="form-control mb-3"
            />
            <div className="d-flex justify-content-between">
              <button onClick={handleAddImage} className="btn btn-primary">
                Upload
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Recently Deleted Strip with Hover Buttons */}
      <AnimatePresence>
        {showDeleted && recentlyDeleted.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="position-fixed bottom-0 start-0 end-0 bg-white border-top py-2 px-3 shadow-sm d-flex gap-3 overflow-auto align-items-end"
            style={{
              zIndex: 1050,
              maxHeight: "170px",
            }}
          >
            {recentlyDeleted.map((img) => (
              <div
                key={img._id}
                className="flex-shrink-0 text-center border rounded-3 bg-white shadow-sm position-relative overflow-hidden"
                style={{ width: "130px", cursor: "pointer" }}
              >
                <div
                  className="position-relative rounded-2 overflow-hidden"
                  style={{ height: "100px" }}
                >
                  <img
                    src={`https://jr-school-67nt.onrender.com${img.filePath}`}
                    alt={img.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                  {/* Hover Buttons */}
                  <div
                    className="position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-50 opacity-0"
                    style={{ transition: "opacity 0.3s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(img._id);
                      }}
                      className="btn btn-success btn-sm py-0 px-2 mb-1"
                      style={{
                        fontSize: "0.75rem",
                        lineHeight: "1.1",
                        borderRadius: "0.25rem",
                      }}
                    >
                      ♻ Restore
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePermanentDelete(img._id);
                      }}
                      className="btn btn-danger btn-sm py-0 px-2"
                      style={{
                        fontSize: "0.75rem",
                        lineHeight: "1.1",
                        borderRadius: "0.25rem",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
                {/* Title inside image (flat bar) */}
                <div className="position-absolute bottom-0 start-0 end-0 bg-dark text-white px-2 py-1 small">
                  <div className="fw-semibold text-truncate">
                    {img.title || "Untitled"}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}



