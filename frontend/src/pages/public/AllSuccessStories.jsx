import { useEffect, useState } from "react";
import StoryCard from "../../components/StoryCard";
import { getAllStories } from "../../api/storyApi";

export default function AllSuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStories()
      .then((res) => setStories(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary-600 mb-2">
          Success Stories
        </h1>
        <p className="text-neutral-500 mb-8">
          Real adopters, real happy endings. Every story here started with
          someone just like you.
        </p>

        {loading ? (
          <p className="text-neutral-500">Loading stories...</p>
        ) : stories.length === 0 ? (
          <p className="text-neutral-500">
            No stories shared yet — be the first!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
