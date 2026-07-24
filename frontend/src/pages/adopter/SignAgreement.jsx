import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate, useParams } from "react-router-dom";
import { signAgreement } from "../../api/applicationApi";

export default function SignAgreement() {
  const { id } = useParams();
  const sigRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClear = () => sigRef.current.clear();

  const handleSubmit = async () => {
    setError("");
    if (sigRef.current.isEmpty()) {
      setError("Please draw your signature before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      await signAgreement(id, dataUrl);
      navigate("/applications");
    } catch (err) {
      setError(err.response?.data?.error || "Could not submit signature.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-primary-600 mb-2">
          Sign Adoption Agreement
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          By signing below, you agree to the adoption terms and confirm your
          commitment to caring for this pet.
        </p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="border-2 border-dashed rounded-xl overflow-hidden mb-3 bg-white">
          <SignatureCanvas
            ref={sigRef}
            penColor="#256e4e"
            canvasProps={{ width: 460, height: 180, className: "w-full" }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 border rounded-xl py-2 text-sm"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-primary-500 text-white rounded-xl py-2 text-sm hover:bg-primary-600 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Signature"}
          </button>
        </div>
      </div>
    </div>
  );
}
