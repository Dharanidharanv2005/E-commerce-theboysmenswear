import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "/products?sort=new" },
    { name: "Shirts", href: "/products?category=Shirts" },
    { name: "Trousers", href: "/products?category=Trousers" },
    { name: "Blazers", href: "/products?category=Blazers" },
    { name: "Sale", href: "/products?sale=true" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchange", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Store Locator", href: "/stores" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-2xl font-bold">THE BOYS</h3>
              <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
                Men&apos;s Wear
              </p>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Premium men&apos;s fashion built on quality fabrics, refined tailoring,
              and everyday comfort for modern wardrobes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.instagram.com/the_boys_menswear?igsh=bHNnaGc1Nm9xd3My" target="_blank" rel="noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-foreground/70 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-primary-foreground/80">
                    30, Paramathi Rd, opposite to Hotel Priya Towers, S P Pudur, Thillaipuram, Namakkal, Tamil Nadu 637001
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary-foreground/70 flex-shrink-0" />
                  <span className="text-sm text-primary-foreground/80">
                    063812 36328
                  </span>
                </li>
                <li>
                  <h5 className="text-sm font-medium text-primary-foreground/90">Hours</h5>
                  <ul className="text-sm text-primary-foreground/80 mt-1 space-y-0.5">
                    <li>Thursday	9:30 am–11 pm</li>
                    <li>Friday	9:30 am–11 pm</li>
                    <li>Saturday	9:30 am–11 pm</li>
                    <li>Sunday	10 am–11 pm</li>
                    <li>Monday	9:30 am–10:30 pm</li>
                    <li>Tuesday	9:30 am–11 pm</li>
                    <li>Wednesday	9:30 am–11 pm</li>
                  </ul>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary-foreground/70 flex-shrink-0" />
                  <span className="text-sm text-primary-foreground/80">
                    theboysmenswearnkl@gmail.com
                  </span>
                </li>
              </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/70">
              &copy; {new Date().getFullYear()} The Boys Men&apos;s Wear. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
