import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createStory, uploadStoryImage } from "../../api/storyApi";

export default function ShareStory() {
  const { petId } = useParams();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data) => {
    setError("");
    setSubmitting(true);
    try {
      const res = await createStory(petId, data);
      if (selectedFile) {
        await uploadStoryImage(res.data.id, selectedFile);
      }
      navigate("/stories");
    } catch (err) {
      setError(err.response?.data?.error || "Could not share your story.");
    } finally {
      setSubmitting(false);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full border rounded-xl px-3 py-2"
              placeholder="e.g. Max found his forever home!"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Your Story</label>
            <textarea
              {...register("description", { required: true })}
              rows={5}
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Tell us how it's going..."
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Photo</label>
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 text-sm shadow-sm hover:bg-white"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-32 cursor-pointer text-neutral-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                <span className="text-sm">
                  Click to add a photo of your pet (optional)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-500 text-white rounded-xl py-2.5 hover:bg-primary-600 disabled:opacity-50"
          >
            {submitting ? "Sharing..." : "Share Story"}
          </button>
        </form>
      </div>
    </div>
  );
}
