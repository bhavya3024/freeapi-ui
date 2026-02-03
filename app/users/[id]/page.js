'use client';
import { getUserById } from "../../../src/apis/users";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await getUserById(id);
        setUser(data);
      } catch (err) {
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <Link href="/users" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Users</Link>
        <div className="text-red-500">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/users" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Users
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="flex items-start gap-6 mb-8">
          {user.picture?.large && (
            <img 
              src={user.picture.large} 
              alt={`${user.name.first} ${user.name.last}`}
              className="w-32 h-32 rounded-full border-4 border-blue-100 shadow-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user.name.title} {user.name.first} {user.name.last}
            </h1>
            <p className="text-gray-500 capitalize">{user.gender} • {user.nat}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              📧 Contact Information
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Email:</span> {user.email}</p>
              <p><span className="text-gray-500">Phone:</span> {user.phone}</p>
              <p><span className="text-gray-500">Cell:</span> {user.cell}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              📍 Location
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Street:</span> {user.location.street.number} {user.location.street.name}</p>
              <p><span className="text-gray-500">City:</span> {user.location.city}</p>
              <p><span className="text-gray-500">State:</span> {user.location.state}</p>
              <p><span className="text-gray-500">Country:</span> {user.location.country}</p>
              <p><span className="text-gray-500">Postcode:</span> {user.location.postcode}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              🎂 Personal Details
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Date of Birth:</span> {new Date(user.dob.date).toLocaleDateString()}</p>
              <p><span className="text-gray-500">Age:</span> {user.dob.age} years</p>
              <p><span className="text-gray-500">Registered:</span> {new Date(user.registered.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              🔐 Login Info
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Username:</span> {user.login.username}</p>
              <p><span className="text-gray-500">UUID:</span> <span className="font-mono text-xs">{user.login.uuid}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
