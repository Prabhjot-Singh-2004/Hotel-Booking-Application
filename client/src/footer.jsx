export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-8 w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* About */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">About</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">How it works</a></li>
            <li><a href="#" className="hover:underline">Newsroom</a></li>
            <li><a href="#" className="hover:underline">Investors</a></li>
            <li><a href="#" className="hover:underline">Airhotel Plus</a></li>
            <li><a href="#" className="hover:underline">Airhotel Luxe</a></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Community</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Diversity & Belonging</a></li>
            <li><a href="#" className="hover:underline">Accessibility</a></li>
            <li><a href="#" className="hover:underline">Invite friends</a></li>
            <li><a href="#" className="hover:underline">Airhotel.org</a></li>
          </ul>
        </div>

        {/* Host */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Host</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Host your home</a></li>
            <li><a href="#" className="hover:underline">Host an experience</a></li>
            <li><a href="#" className="hover:underline">Responsible hosting</a></li>
            <li><a href="#" className="hover:underline">Community Center</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Safety information</a></li>
            <li><a href="#" className="hover:underline">Cancellation options</a></li>
            <li><a href="#" className="hover:underline">Report neighborhood concern</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Airhotel, Inc. · Privacy · Terms · Sitemap</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" aria-label="Facebook" className="hover:text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.17 8.44 9.92v-7.02H7.9v-2.9h2.4v-2.2c0-2.38 1.42-3.7 3.6-3.7 1.04 0 2.12.18 2.12.18v2.33h-1.2c-1.18 0-1.55.73-1.55 1.48v1.9h2.64l-.42 2.9h-2.22v7.02c4.78-.75 8.44-4.9 8.44-9.92z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.59 8.59 0 0 1-2.72 1.04 4.26 4.26 0 0 0-7.3 3.88A12.1 12.1 0 0 1 3.16 4.9a4.25 4.25 0 0 0 1.32 5.68 4.24 4.24 0 0 1-1.93-.54v.05a4.26 4.26 0 0 0 3.42 4.18 4.28 4.28 0 0 1-1.92.07 4.27 4.27 0 0 0 3.98 2.96A8.53 8.53 0 0 1 2 19.54a12.04 12.04 0 0 0 6.52 1.91c7.83 0 12.11-6.48 12.11-12.1l-.01-.55A8.65 8.65 0 0 0 22.46 6z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.5-.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
