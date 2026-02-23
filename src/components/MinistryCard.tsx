import type { MinistryResponse } from "../types/ministry";

interface MinistryCardProps {
  ministry: MinistryResponse;
}

export function MinistryCard({ ministry }: MinistryCardProps) {
  const { name, description } = ministry;

  return (
    <div className="p-4 bg-white border border-gray-200 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10 max-w-80">
      <img
        className="rounded-md max-h-40 w-full object-cover"
        src="https://exibirgospel.com.br/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-11-at-22.25.02.jpeg"
        alt="Ministerio sem foto"
      />
      <p className="text-gray-900 text-xl font-semibold ml-2 mt-4">{name}</p>
      <p className="text-zinc-400 text-sm/6 mt-2 ml-2 mb-2">{description}</p>
      <button
        type="button"
        className="bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded-md text-white text-sm"
      >
        Ver escalas
      </button>
    </div>
  );
}
