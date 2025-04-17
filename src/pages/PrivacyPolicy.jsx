import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <h1>Privacy Policy</h1>
      <div className="privacy-content">
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Account information (name, email, password)</li>
            <li>Content you upload or create</li>
            <li>Communication preferences</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Improve user experience</li>
            <li>Send important updates and notifications</li>
            <li>Analyze usage patterns</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>4. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            support@wavyboard.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 