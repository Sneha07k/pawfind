import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { submitApplication } from "../../api/applicationApi";

export default function ApplyForAdoption() {
  const { petId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      await submitApplication(petId, data);
      navigate("/applications");
    } catch (err) {
      setError(err.response?.data?.error || "Could not submit application.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-primary-600 mb-2">
          Adoption Application
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          Tell the shelter a bit about yourself and your home — this helps them
          find the right match.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Full Name</label>
            <input
              {...register("fullName", { required: true })}
              className="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Phone Number
            </label>
            <input
              {...register("phoneNumber", { required: true })}
              className="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Address</label>
            <input
              {...register("address", { required: true })}
              className="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Occupation</label>
            <input
              {...register("occupation", { required: true })}
              className="w-full border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">House Type</label>
            <select
              {...register("houseType", { required: true })}
              className="w-full border rounded-xl px-3 py-2"
            >
              <option value="">Select...</option>
              <option value="Apartment">Apartment</option>
              <option value="Independent House">Independent House</option>
              <option value="Villa">Villa</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Previous Pet Experience
            </label>
            <textarea
              {...register("previousPetExperience")}
              rows={2}
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Existing Pets
            </label>
            <textarea
              {...register("existingPets")}
              rows={2}
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Optional — any pets you currently have"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Why do you want to adopt this pet?
            </label>
            <textarea
              {...register("reasonForAdoption", { required: true })}
              rows={3}
              className="w-full border rounded-xl px-3 py-2"
            />
          </div>
          {errors.reasonForAdoption && (
            <p className="text-red-500 text-xs">This field is required</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary-500 text-white rounded-xl py-2.5 mt-2 hover:bg-primary-600"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
