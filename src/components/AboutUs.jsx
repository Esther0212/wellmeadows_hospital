import React from "react";
import { useLocation } from "react-router-dom";
import SidePanel from "../globalcomponents/SidePanel";
import TopPanel from "../globalcomponents/TopPanel";
import { Paper, Typography } from "@mui/material"; // Importing Material-UI components
import "./AboutUs.css"; // Import the CSS file

const AboutUs = () => {
  const location = useLocation();
  const { staff_num, first_name, last_name } = location.state || {};

  return (
    <div className="dashboard-container">
      <SidePanel
        staff_num={staff_num}
        firstName={first_name}
        lastName={last_name}
      />
      <div className="content-area">
        <TopPanel
          staff_num={staff_num}
          firstName={first_name}
          lastName={last_name}
        />
        <div className="about-us-panel">
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" gutterBottom>
              <h2>About Us</h2>
            </Typography>
            <Typography variant="body1">
              <h3>Welcome to Wellmeadows Hospital</h3>
              <p>
                Situated in the heart of Edinburgh, Wellmeadows Hospital is a
                dedicated healthcare facility specializing in the provision of
                high-quality medical care for elderly people. Our hospital is
                committed to enhancing the health and well-being of our senior
                community members through compassionate, personalized, and
                comprehensive healthcare services.
              </p>
              <h3>Our Mission</h3>
              <p>
                At Wellmeadows Hospital, our mission is to deliver exceptional
                healthcare to elderly individuals, ensuring they receive the
                respect, dignity, and care they deserve. We are dedicated to
                promoting healthy aging and improving the quality of life for
                our patients through expert medical care and supportive
                services.
              </p>
              <h3>Our Vision</h3>
              <p>
                We envision a future where Wellmeadows Hospital stands as a
                beacon of excellence in elderly care, recognized for our
                innovative approaches and commitment to patient-centered
                services. Our goal is to continuously improve and adapt to meet
                the evolving needs of our aging population.
              </p>
              <h3>Values</h3>
              <ul>
                <li>
                  <b>Compassion:</b> We approach every patient with kindness and
                  empathy, understanding the unique challenges faced by the
                  elderly.
                </li>
                <li>
                  <b>Respect:</b> We honor the dignity and individual needs of
                  each patient, providing care that respects their personal
                  preferences and cultural values.
                </li>
                <li>
                  <b>Quality:</b> We strive for the highest standards in all
                  aspects of our healthcare delivery, ensuring safe and
                  effective treatments.
                </li>
                <li>
                  <b>Integrity:</b> We maintain transparency, honesty, and
                  ethical practices in all our interactions.
                </li>
                <li>
                  <b>Community:</b> We foster a supportive and inclusive
                  environment for patients, families, and staff.
                </li>
              </ul>
              <h3>Our Services</h3>
              <p>
                Wellmeadows Hospital offers a range of specialized services
                designed to address the comprehensive needs of elderly patients,
                including:
              </p>
              <ul>
                <li>
                  <b>Geriatric Care:</b> Specialized medical care focused on the
                  health and well-being of older adults.
                </li>
                <li>
                  <b>Chronic Disease Management:</b> Comprehensive management
                  and treatment of chronic conditions common in the elderly,
                  such as diabetes, hypertension, and arthritis.
                </li>
                <li>
                  <b>Rehabilitation Services:</b> Physical, occupational, and
                  speech therapy to help patients regain independence and
                  improve their quality of life.
                </li>
                <li>
                  <b>Palliative Care:</b> Compassionate care aimed at relieving
                  symptoms and improving the comfort of patients with serious
                  illnesses.
                </li>
                <li>
                  <b>Mental Health Services:</b> Support for mental health
                  issues such as depression, anxiety, and dementia, with a focus
                  on holistic and patient-centered approaches.
                </li>
              </ul>
              <h3>Our Team </h3>
              <p>
                Our dedicated team at Wellmeadows Hospital includes experienced
                geriatricians, nurses, therapists, and support staff who are
                passionate about elderly care. We invest in continuous training
                and professional development to ensure our team remains at the
                forefront of medical advancements and best practices in
                geriatric healthcare.
              </p>
              <h3>Community Involvement</h3>
              <p>
                Wellmeadows Hospital is deeply embedded in the Edinburgh
                community. We actively engage in community outreach programs,
                health education workshops, and wellness initiatives aimed at
                promoting healthy aging and supporting caregivers.
              </p>
              <h3>Contact Us</h3>
              <p>
                For more information about our services or to schedule an
                appointment, please contact us at: Wellmeadows Hospital
                Edinburgh, EH1 1BB Thank you for choosing Wellmeadows Hospital.
                We are honored to be your trusted partner in elderly healthcare.
              </p>
            </Typography>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
