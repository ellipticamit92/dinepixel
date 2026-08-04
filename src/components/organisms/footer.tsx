import { Logo } from "@/components/atoms/logo";
import { FooterColumn } from "@/components/molecules/footer-column";

const columns = [
  { title: "Product", links: ["Features", "Pricing", "QR Gallery"] },
  { title: "Resources", links: ["API Docs", "Blog", "Support"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
  { title: "Contact", links: ["Sales", "Help Desk"] },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex max-w-xs flex-col gap-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Empowering the hospitality industry with cutting-edge AI menu
              solutions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MenuAI Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
