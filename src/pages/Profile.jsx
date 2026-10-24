import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";



export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="p-10 text-center text-red-400">
          Please login to view profile
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex justify-center items-center mt-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 w-[400px] shadow-xl">

          <h1 className="text-3xl font-bold text-yellow-400 mb-6">
            My Profile
          </h1>

          <div className="space-y-4">
            <p>
              <span className="text-gray-400">Name:</span>{" "}
              <span className="font-semibold">
                {user.name || "N/A"}
              </span>
            </p>

            <p>
              <span className="text-gray-400">Email:</span>{" "}
              <span className="font-semibold">
                {user.email || "N/A"}
              </span>
            </p>

            <p>
              <span className="text-gray-400">Role:</span>{" "}
              <span className="font-semibold text-green-400">
                {user.role || "USER"}
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}