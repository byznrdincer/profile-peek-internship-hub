
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  useEffect(() => {
    document.title = "Terms and Conditions - InternStack";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Last Updated: {new Date().toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using InternStack, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
                <p className="text-gray-600">
                  InternStack is a platform that connects students seeking internship opportunities with recruiters and companies. 
                  Students can create profiles showcasing their skills and projects, while recruiters can search for and connect with potential candidates.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-gray-600 mb-3">
                  To use certain features of our service, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Keeping your profile information up to date</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. User Conduct</h2>
                <p className="text-gray-600 mb-3">
                  Users agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Upload false, misleading, or fraudulent information</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Use the platform for spam or unauthorized commercial purposes</li>
                  <li>Attempt to gain unauthorized access to other accounts or systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Content and Intellectual Property</h2>
                <p className="text-gray-600 mb-3">
                  You retain ownership of the content you post on InternStack. However, by posting content, you grant us a non-exclusive, 
                  worldwide, royalty-free license to use, display, and distribute your content on the platform.
                </p>
                <p className="text-gray-600">
                  All content and materials on InternStack, including but not limited to text, graphics, logos, and software, 
                  are the property of InternStack or its licensors and are protected by copyright and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. Privacy and Data Protection</h2>
                <p className="text-gray-600">
                  Your privacy is important to us. We collect and use your personal information in accordance with our Privacy Policy. 
                  By using our service, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Disclaimer of Warranties</h2>
                <p className="text-gray-600">
                  InternStack is provided "as is" without any warranties, express or implied. We do not guarantee that the service will be 
                  uninterrupted, secure, or error-free. We are not responsible for the accuracy of user-generated content or the outcome 
                  of connections made through our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
                <p className="text-gray-600">
                  InternStack shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                  resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">9. Termination</h2>
                <p className="text-gray-600">
                  We may terminate or suspend your account and access to the service immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right to modify these terms at any time. We will notify users of any changes by posting 
                  the new Terms and Conditions on this page. Your continued use of the service after any such changes 
                  constitutes your acceptance of the new Terms and Conditions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">11. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms and Conditions, please contact us through our platform 
                  or reach out to our support team.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
