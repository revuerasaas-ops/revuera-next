import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  const y = new Date().getFullYear();
  const groups = [
    { title: "Product", links: FOOTER_LINKS.product },
    { title: "Resources", links: FOOTER_LINKS.resources },
    { title: "Free Tools", links: FOOTER_LINKS.tools },
    { title: "Legal", links: FOOTER_LINKS.legal },
  ];

  return (
    <footer className="border-t border-stone-200/70 bg-stone-50/30">
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-[18px] font-extrabold text-stone-900 tracking-tighter">Revuera</span>
              <span className="text-[18px] font-extrabold text-brand-600">.</span>
            </Link>
            <p className="mt-4 text-body-sm text-stone-400 max-w-[220px] leading-relaxed">
              Turn happy customers into 5-star Google reviews. Built in Sydney.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-500 rounded-full" />
              <span className="text-[11px] text-stone-400 font-medium">Sydney, Australia</span>
            </div>
          </div>

          {/* Link columns */}
          {groups.map((group) => (
            <div key={group.title}>
              <h5 className="text-[12px] font-semibold text-stone-900 uppercase tracking-[0.1em] mb-4">{group.title}</h5>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[13px] text-stone-400 hover:text-brand-600 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-stone-400">© {y} Revuera Pty Ltd · ABN 23 308 272 266</p>
          <p className="text-[11px] text-stone-300">Made with care in Sydney</p>
        </div>
      </div>
    </footer>
  );
}
