import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createStory, uploadStoryImage } from "../../api/storyApi";

export default function ShareStory() {
  const { petId } = useParams();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [storyId, setStoryId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data) => {
    setError("");
    try {
      const res = await createStory(petId, data);
      setStoryId(res.data.id);
    } catch (err) {
      setError(err.response?.data?.error || "Could not share your story.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !storyId) return;
    setUploading(true);
    try {
      const res = await uploadStoryImage(storyId, file);
      setImageUrl(res.data.imageUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-primary-600 mb-2">
          Share Your Success Story
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          Inspire future adopters by sharing how your new companion is settling
          in.
        </p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {!storyId ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>
              <input
                {...register("title", { required: true })}
                className="w-full border rounded-xl px-3 py-2"
                placeholder="e.g. Max found his forever home!"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Your Story
              </label>
              <textarea
                {...register("description", { required: true })}
                rows={5}
                className="w-full border rounded-xl px-3 py-2"
                placeholder="Tell us how it's going..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-500 text-white rounded-xl py-2.5 hover:bg-primary-600"
            >
              Continue
            </button>
          </form>
        ) : (
          <div>
            <p className="text-primary-600 text-sm mb-3">
              Story saved! Add a photo to bring it to life (optional).
            </p>
            {imageUrl && (
              <img
                src={imageUrl}
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <button
              onClick={() => navigate("/")}
              className="block mt-4 text-sm text-primary-600"
            >
              Done — view on homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
