import Image from "next/image";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Free API UI</h1>
      <p className="text-lg text-gray-600 mb-2">
        This is a user interface designed to interact with various free APIs available on the web.
      </p>
      <p className="text-lg text-gray-600">
        Navigate using the sidebar to explore different API categories like Users, Products, and Jokes.
      </p>
      {/* You can add more introductory content, images, or links here */}
    </div>
  );
}
