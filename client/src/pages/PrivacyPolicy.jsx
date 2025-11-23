import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-muted p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">TrackSure — Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="mb-8">
              This Privacy Policy describes how TrackSure collects, uses, and protects user data.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">1.1 Account Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name</li>
                <li>Email</li>
                <li>Role and tenant (organization)</li>
                <li>Authentication credentials (hashed)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">1.2 Product & Supply Chain Data</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Product creation records</li>
                <li>QR codes</li>
                <li>Ownership transfers</li>
                <li>Status updates</li>
                <li>Activity logs</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">1.3 Uploaded Documents (Cloudinary)</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Photos</li>
                <li>PDFs</li>
                <li>Certificates</li>
                <li>Invoices</li>
              </ul>
              <p className="mb-4">
                Uploaded files are stored using Cloudinary's infrastructure.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">1.4 Communications</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Emails</li>
                <li>Notifications</li>
                <li>TrackBot messages</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">1.5 Technical & Usage Data</h3>
              <p className="mb-2">Collected automatically:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>IP address</li>
                <li>Browser/device information</li>
                <li>Timestamps</li>
                <li>API events</li>
                <li>WebSocket activity</li>
                <li>Error logs</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">1.6 AI Interaction Data</h3>
              <p className="mb-4">
                Messages sent to TrackBot are processed by third-party AI providers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
              <p className="mb-2">We use collected data to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide and operate the TrackSure platform</li>
                <li>Verify product authenticity</li>
                <li>Manage supply chain workflows</li>
                <li>Generate dashboard analytics</li>
                <li>Provide customer support</li>
                <li>Detect fraud, suspicious activity, or abuse</li>
                <li>Improve AI accuracy and system performance</li>
                <li>Send emails for verification, password reset, notifications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
              <p className="mb-4">
                We do not sell your data.
              </p>
              <p className="mb-2">We may share data with:</p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Service Providers</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Cloudinary (file storage)</li>
                <li>Email providers (Nodemailer + SMTP)</li>
                <li>AI providers (TrackBot)</li>
                <li>Hosting providers</li>
                <li>Analytics tools</li>
              </ul>
              <p className="mb-4">
                These providers process data only on our behalf.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Legal Requirements</h3>
              <p className="mb-2">We may disclose data if required by:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Law</li>
                <li>Court order</li>
                <li>Government request</li>
                <li>Security incident investigation</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Business Transfers</h3>
              <p className="mb-4">
                If TrackSure is acquired or merged, your data may be transferred under the same privacy protections.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
              <p className="mb-2">We retain:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Account data while your account is active</li>
                <li>Logs as needed for audit and security</li>
                <li>AI messages for contextual chat memory</li>
                <li>Documents unless deleted by users</li>
              </ul>
              <p className="mb-4">
                You may request deletion of your account and data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Security</h2>
              <p className="mb-2">We use industry-standard protections:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Hashed passwords</li>
                <li>JWT authentication</li>
                <li>Role-based access control</li>
                <li>Tenant-level data isolation</li>
                <li>HTTPS encryption</li>
                <li>WebSocket authentication</li>
                <li>Cloudinary signed URLs (when enabled)</li>
              </ul>
              <p className="mb-4">
                No system is 100% secure, but we take reasonable steps to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p className="mb-4">
                Depending on your jurisdiction, you may:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access your data</li>
                <li>Correct inaccurate information</li>
                <li>Download/export your data</li>
                <li>Delete your account</li>
                <li>Restrict processing</li>
                <li>Object to AI processing (TrackBot)</li>
              </ul>
              <p className="mb-2">Requests can be made via:</p>
              <p className="mb-4 italic text-muted-foreground">
             gulammuhammadahmad216@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies & Tracking</h2>
              <p className="mb-2">TrackSure may use:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Session cookies</li>
                <li>Local storage (for dark mode, tokens)</li>
                <li>Browser storage for preferences</li>
                <li>Analytics tracking for performance monitoring</li>
              </ul>
              <p className="mb-4">
                Users may disable cookies, but some features may not work.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
              <p className="mb-4">
                TrackSure does not knowingly collect data from users under 13 (or local minimum age).
              </p>
              <p className="mb-4">
                If you believe a minor has used the platform, contact us for removal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
              <p className="mb-4">
                Your data may be stored or processed in other countries through our service providers.
              </p>
              <p className="mb-4">
                We ensure adequate protections regardless of location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy. Continued use of the Service indicates acceptance of changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
              <p className="mb-2">For questions about privacy, data rights, or account deletion:</p>
              <p className="mb-4 italic text-muted-foreground">
                gulammuhammadahmad216@gmail.com
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

