export default function StoryCard({ story }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {(story.imageUrl || story.petImage) && (
        <img
          src={story.imageUrl || story.petImage}
          alt={story.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold">{story.title}</h3>
        <p className="text-sm text-neutral-600 mt-1 line-clamp-3">
          {story.description}
        </p>
        <p className="text-xs text-neutral-400 mt-2">
          {story.adopterName} & {story.petName} ·{" "}
          {new Date(story.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
