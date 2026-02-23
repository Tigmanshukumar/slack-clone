export default function AppFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] bg-[#0F0F10] px-6 py-5 text-sm text-[#71717A]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#A1A1AA]">Slack Chat</span>
          <span className="hidden sm:inline">•</span>
          <span>v1.0.0</span>
        </div>
          <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="https://github.com/Tigmanshukumar/slack-clone" className="hover:text-white transition">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
