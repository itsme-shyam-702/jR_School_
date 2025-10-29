import React, { useState } from "react";
import api from "../api/admission"; // same as your existing setup

function Admissions() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    parentName: "",
    contact: "",
    address: "",
    selectedClass: "",
  });

  const [status, setStatus] = useState("");
  const [agreeOffline, setAgreeOffline] = useState(false);

  const subjectsOffered = [
    "Kannada",
    "English",
    "Hindi",
    "Mathematics",
    "Science",
    "Social Studies",
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Work Experience / SUPW",
    "Physical Education",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeOffline) {
      setStatus("⚠️ Please confirm that you have read the Offline Admission Process before submitting.");
      return;
    }

    try {
      setStatus("Submitting your form...");
      const res = await api.submitAdmission(formData);
      if (res?.status === 200 || res?.status === 201) {
        setStatus("✅ Admission form submitted successfully!");
        setFormData({
          name: "",
          dob: "",
          parentName: "",
          contact: "",
          address: "",
          selectedClass: "",
        });
        setAgreeOffline(false);
      } else {
        setStatus("❌ Submission failed. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error submitting form. Please try again.");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/images/admissions-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "60px 0",
      }}
    >
      <div className="container bg-light bg-opacity-75 p-5 rounded-4 shadow-lg">
        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary">Admission Form</h1>
          <p className="text-muted">
            Fill in the details below to apply for admission to Government Junior Technical School.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Student Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Parent / Guardian Name</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter parent or guardian name"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Contact Number</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter valid contact number"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Enter residential address"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Select Class</label>
              <select
                name="selectedClass"
                value={formData.selectedClass}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Class --</option>
                <option value="8th">8th Standard</option>
                <option value="9th">9th Standard</option>
                <option value="10th">10th Standard</option>
              </select>
            </div>

            <div className="col-12">
              <h5 className="mt-4 fw-bold text-primary">Subjects Offered</h5>
              <ul className="list-unstyled ms-3 mt-2">
                {subjectsOffered.map((subject, idx) => (
                  <li key={idx}>• {subject}</li>
                ))}
              </ul>
            </div>

            <div className="col-12 mt-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="offlineConfirm"
                  checked={agreeOffline}
                  onChange={(e) => setAgreeOffline(e.target.checked)}
                  required
                />
                <label htmlFor="offlineConfirm" className="form-check-label">
                  I confirm that I have read and will follow the <strong>Offline Admission Process</strong>.
                </label>
              </div>
            </div>

            <div className="col-12 text-center mt-3">
              <button type="submit" className="btn btn-primary px-5 fw-semibold">
                Submit
              </button>
            </div>

            {status && (
              <div className="col-12 mt-3">
                <div className="alert alert-info text-center">{status}</div>
              </div>
            )}
          </div>
        </form>

        {/* Offline Admission Process Section */}
        <div className="mt-5">
          <h4 className="fw-bold text-primary mb-3">Offline Admission Process</h4>
          <ol className="list-group list-group-numbered mb-3">
            <li className="list-group-item">Visit the school office between 9:00 AM and 4:00 PM.</li>
            <li className="list-group-item">Collect the admission form from the office counter.</li>
            <li className="list-group-item">Fill the form carefully with accurate details.</li>
            <li className="list-group-item">
              Attach the required documents: Birth Certificate, Transfer Certificate, and recent photographs.
            </li>
            <li className="list-group-item">Submit the form at the office along with the admission fee.</li>
            <li className="list-group-item">
              Collect the acknowledgment receipt and confirmation slip from the school.
            </li>
          </ol>
          <p className="text-muted">
            <strong>Note:</strong> Completing the above offline process is mandatory to confirm your admission.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admissions;
