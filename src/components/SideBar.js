import Link from 'next/link';

export default function SideBar() {
  const menuItems = ["Users", "Products", "Jokes"];

  return (
    <div className="w-[200px] h-full bg-gray-200 p-4">
      <h1 className="text-lg font-semibold mb-4">Menu</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item} className="mb-2">
            <Link href={`/${item.toLowerCase()}`} className="text-gray-700 hover:text-black">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}