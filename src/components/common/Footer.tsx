import React from 'react';
import { CodeSparkLogo } from '../brand/CodeSparkLogo';
import { Link } from '../../router/Link';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#09090c] pt-16 pb-24 md:pb-16 text-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <CodeSparkLogo size="sm" animate={false} />
            </div>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/50">
              The high-focus algorithmic operating system. Master data structures, recognize reusable problem patterns, and prepare for premier technical interviews with deliberate Socratic practice.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <span className="text-[11px] text-white/40">
                Deliberate practice with electric precision.
              </span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="lumen-tag text-white/90">Product</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/problems" className="hover:text-white transition-colors">
                  Problems
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/contests" className="hover:text-white transition-colors">
                  Contests
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="lumen-tag text-white/90">Resources</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/patterns" className="hover:text-white transition-colors">
                  DSA Patterns
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Interview Roadmap
                </Link>
              </li>
              <li>
                <Link href="/problems" className="hover:text-white transition-colors">
                  Curated Guides
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Daily Challenges
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Legal */}
          <div>
            <h4 className="lumen-tag text-white/90">Community & Legal</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/discussions" className="hover:text-white transition-colors">
                  Discussions
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Preferences
                </Link>
              </li>
              <li>
                <span className="text-white/40">Privacy Policy</span>
              </li>
              <li>
                <span className="text-white/40">Terms of Service</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom divider & copyright */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-[11px] text-white/40 sm:flex-row">
          <p>© 2026 CodeSpark. All rights reserved. Deliberate practice for modern developers.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-amber-400/80 transition-colors">
              Platform Admin
            </Link>
            <span>v1.0.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
};;
