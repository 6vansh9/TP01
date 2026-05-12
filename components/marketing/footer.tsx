import Link from "next/link"

const footerSections = [
  {
    title: "For Clients",
    links: ["How to hire", "Talent Marketplace", "Project Catalog", "Hire an agency", "Enterprise", "Direct Contracts"],
  },
  {
    title: "For Talent",
    links: ["How to find work", "Direct Contracts", "Find freelance jobs worldwide", "Win work with Upwork"],
  },
  {
    title: "Resources",
    links: ["Help & support", "Success stories", "Upwork reviews", "Resources", "Blog", "Community"],
  },
  {
    title: "Company",
    links: ["About us", "Leadership", "Investor relations", "Careers", "Upwork Foundation", "Press"],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold">Social</h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Twitter/X
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <p>&copy; 2026 Upwork. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
