import React from "react";

const About = () => {
  const backgroundStyle = {
    backgroundImage: "url('/images/about-bg.jpg')", // ✅ replace with your real image name
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    paddingTop: "4rem",
    paddingBottom: "4rem",
  };

  return (
    <div style={backgroundStyle}>
      <div className="container bg-light bg-opacity-75 rounded-4 shadow-sm p-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-3">About Our School</h1>
          <p className="text-muted fs-5">
            Government Junior Technical School provides students with a strong foundation
            in both academic and technical education, empowering them with practical
            skills and knowledge to succeed in a modern world.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/images/s21.png"
              alt="School building"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-semibold mb-3">Our Mission</h2>
            <p className="text-muted">
              To nurture and inspire young minds by providing quality education that
              blends academics, creativity, and technical excellence. Our mission is to
              cultivate discipline, innovation, and lifelong learning in every student.
            </p>

            <h2 className="fw-semibold mt-4 mb-3">Our Vision</h2>
            <p className="text-muted">
              To become a center of excellence in secondary technical education, producing
              future leaders, innovators, and responsible citizens.
            </p>
          </div>
        </div>

        {/* History Section */}
        <div className="row flex-md-row-reverse align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/images/s11.png"
              alt="Students learning"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-semibold mb-3">Our History</h2>
            <p className="text-muted">
              Established in 1950, Government Junior Technical School has been a
              cornerstone in technical education for decades. With a legacy of excellence,
              our institution has continuously evolved to meet the demands of the modern
              world while upholding traditional values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
