import { useEffect, useState } from "react";
import { getFavoriteStatus, toggleFavorite } from "../api/favoriteApi";
import { useAuth } from "../context/AuthContext";

export default function FavoriteButton({ petId, className = "" }) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getFavoriteStatus(petId).then((res) => setFavorited(res.data.favorited));
  }, [petId, user]);

  if (!user) return null; // only adopters/logged-in users can favourite

  const handleClick = async (e) => {
    e.preventDefault(); // prevent navigating if this button sits inside a <Link> card
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await toggleFavorite(petId);
      setFavorited(res.data.favorited);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`text-xl leading-none ${className}`}
      aria-label={favorited ? "Remove from favourites" : "Add to favourites"}
      title={favorited ? "Remove from favourites" : "Add to favourites"}
    >
      {favorited ? "❤️" : "🤍"}
    </button>
  );
}
