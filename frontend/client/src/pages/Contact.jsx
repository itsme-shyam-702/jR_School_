import { useState } from "react";
import api from "../api/contact";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("Sending...");
      await api.sendMessage(formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Failed to send message. Try again.");
    }
  };

  return (
    <section className="position-relative" style={{ minHeight: "100vh" }}>
      {/* ✅ Full-Background Google Map (same as Tailwind) */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <iframe
          title="Jr Technical School Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.4526292970613!2d74.85515908648846!3d12.89192698540115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a142daea297%3A0xfb3240042e04f68!2sJr%20Technical%20School%2C%20Bondel%20Rd%2C%20Kadri%20Hills%2C%20Kadri%2C%20Mangaluru%2C%20Karnataka%20575016!5e0!3m2!1sen!2sin!4v1752823252213!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: "grayscale(1) contrast(1.2) opacity(0.4)", // ✅ exact same visual style
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* ✅ Contact Form Container */}
      <div className="container d-flex justify-content-end align-items-center py-5 position-relative" style={{ zIndex: 2, minHeight: "100vh" }}>
        <div className="col-lg-4 col-md-6 bg-white rounded-4 shadow p-4">
          <h2 className="fw-semibold mb-2 text-dark">Contact Us</h2>
          <p className="text-muted mb-4">
            Reach out to us for admissions, queries, or a campus visit. We'd love to hear from you!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label small text-secondary">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label small text-secondary">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label small text-secondary">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="4"
                placeholder="Your message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Send Message
            </button>

            {status && (
              <p className="mt-2 small text-muted text-center">{status}</p>
            )}
            <p className="mt-3 text-secondary small text-center">
              We'll get back to you within 24 hours during working days.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
