export default function StoryCard({ story }) {
  return (
    <div className="group relative bg-[#FFF9F3] rounded-[32px] p-5 shadow-lg border-2 border-[#F7E7D6] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Decorative stickers */}
      <div className="absolute top-4 right-5 rotate-12 text-xl opacity-70">
        🌼
      </div>

      <div className="absolute bottom-5 left-5 -rotate-12 text-lg opacity-70">
        🐾
      </div>

      {/* Washi tape */}
      {(story.imageUrl || story.petImage) && (
        <div className="relative mb-6 flex justify-center">
          <div className="absolute -top-3 w-20 h-6 bg-yellow-200/70 rounded-sm rotate-[-6deg] shadow-sm" />

          <div className="bg-white p-3 rounded-md shadow-lg rotate-[-2deg] group-hover:rotate-0 transition-transform duration-300">
            <img
              src={story.imageUrl || story.petImage}
              alt={story.title}
              className="w-64 h-52 object-cover rounded-sm"
            />

            <p className="mt-3 text-center text-sm font-semibold text-neutral-700">
              ❤️ {story.petName}
            </p>
          </div>
        </div>
      )}

      {/* Scrapbook title */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📖</span>

        <h3 className="text-xl font-bold text-neutral-800">{story.title}</h3>
      </div>

      {/* Quote */}
      <div className="relative bg-white/70 rounded-2xl p-5 border border-orange-100">
        <span className="absolute left-3 top-1 text-5xl text-orange-200 font-serif">
          "
        </span>

        <p className="text-neutral-700 italic leading-7 px-5">
          {story.description}
        </p>

        <span className="absolute right-3 bottom-[-10px] text-5xl text-orange-200 font-serif">
          "
        </span>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-white flex items-center justify-center font-bold shadow-md">
            {story.adopterName?.charAt(0)}
          </div>

          <div>
            <p className="font-semibold text-neutral-800">
              {story.adopterName}
            </p>

            <p className="text-sm text-neutral-500">
              found a forever friend ❤️
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            🏡 Forever Home
          </div>

          <p className="mt-2 text-xs text-neutral-400">
            {new Date(story.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bottom doodles */}
      <div className="mt-5 flex justify-between text-lg opacity-60">
        <span>🦴</span>
        <span>❤️</span>
        <span>🐾</span>
      </div>
    </div>
  );
}
