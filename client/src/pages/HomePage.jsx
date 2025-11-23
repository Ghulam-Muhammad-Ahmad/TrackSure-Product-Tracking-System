import React from 'react';
import { Hero1 } from '@/components/Herosection';
import { Navbar1 } from '@/components/Landing-header';
import {
  Package,
  QrCode,
  Shield,
  Users,
  FileText,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Zap,
  Lock,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

function HomePage() {
  const features = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Product Tracking",
      description: "Track every product from manufacturer to end customer with complete lifecycle visibility."
    },
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "QR Code Generation",
      description: "Generate unique QR codes for each product with customizable access permissions."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Authenticity Verification",
      description: "Verify product authenticity instantly by scanning QR codes."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Multi-Tenant Support",
      description: "Secure multi-tenant architecture with role-based access control."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Document Management",
      description: "Attach and organize documents, certificates, and warranties per product."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-Time Analytics",
      description: "Get insights with dynamic dashboards and comprehensive reporting."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI Assistant",
      description: "TrackBot AI helps you query products and get insights using natural language."
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with activity logging and audit trails."
    }
  ];

  const benefits = [
    "Reduce counterfeit products",
    "Improve supply chain transparency",
    "Enhance customer trust",
    "Streamline inventory management",
    "Real-time product tracking",
    "Automated status updates"
  ];

  const useCases = [
    {
      title: "Manufacturing",
      description: "Track products from production line to distribution centers.",
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: "Retail",
      description: "Manage inventory and verify product authenticity at point of sale.",
      icon: <Package className="h-6 w-6" />
    },
    {
      title: "Logistics",
      description: "Monitor shipments and transfers across the supply chain.",
      icon: <Globe className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar1 />

      {/* Hero Section */}
      <Hero1 />

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-3 w-3 mr-2" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Track Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive product tracking solution with powerful features designed for modern supply chains.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* @HomePage.jsx (121) --- Add one more feature card in the first section right */}
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <CheckCircle className="h-3 w-3 mr-2" />
                Benefits
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose TrackSure?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                TrackSure provides end-to-end visibility and control over your product lifecycle,
                helping you build trust with customers and optimize operations.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild size="lg">
                  <Link to="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className=" bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
                <img
                  src="/dashboardscreen.png"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Globe className="h-3 w-3 mr-2" />
              Use Cases
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Every Industry
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From manufacturing to retail, TrackSure adapts to your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                    {useCase.icon}
                  </div>
                  <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {useCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Products Tracked</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Product Tracking?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of businesses using TrackSure to ensure product authenticity and streamline operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="#contact">
                Contact Sales
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Mail className="h-3 w-3 mr-2" />
              Contact Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Reach out to us through email or phone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-xl">Email Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <a
                  href="mailto:gulammuhammadahmad216@gmail.com"
                  className="text-lg text-primary hover:underline break-all"
                >
                  gulammuhammadahmad216@gmail.com
                </a>
                <p className="text-sm text-muted-foreground mt-4">
                  We'll respond within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-xl">Call Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <a
                  href="tel:+923210666603"
                  className="text-lg text-primary hover:underline"
                >
                  +92 321 0666603
                </a>
                <p className="text-sm text-muted-foreground mt-4">
                  Available Mon-Fri, 9AM-6PM PKT
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>Based in Pakistan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
                <img src="/tracksurelogo.svg" className="h-8" alt="TrackSure" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for product tracking and authenticity verification.
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-primary transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-primary transition-colors"
                  >
                    Benefits
                  </button>
                </li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:gulammuhammadahmad216@gmail.com"
                    className="hover:text-primary transition-colors"
                  >
                    Email Us
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+923210666603"
                    className="hover:text-primary transition-colors"
                  >
                    Call Us
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="mailto:gulammuhammadahmad216@gmail.com"
                    className="hover:text-primary transition-colors break-all"
                  >
                    gulammuhammadahmad216@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+923210666603"
                    className="hover:text-primary transition-colors"
                  >
                    +92 321 0666603
                  </a>
                </li>
                <li className="text-muted-foreground">
                  Pakistan
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} TrackSure. All rights reserved. Built with ❤️ by <a href="https://github.com/Ghulam-Muhammad-Ahmad" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Ghulam Muhammad Ahmad</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
