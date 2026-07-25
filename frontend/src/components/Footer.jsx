export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-neutral-500">
        <p>
          © {new Date().getFullYear()} PawFind. Every pet deserves a loving
          home.
        </p>
        <p className="flex gap-4">
          <a href="/browse" className="hover:text-primary-600">
            Browse
          </a>
          <a href="/map" className="hover:text-primary-600">
            Nearby
          </a>
          <a href="/register" className="hover:text-primary-600">
            Join as a Shelter
          </a>
        </p>
      </div>
    </footer>
  );
}
