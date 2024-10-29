"use client";

import { PaginationMeta } from "@/app/types/pagination";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.users);
      setMeta(data.meta);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const userData = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        nickname: formData.get('nickname'),
        password: formData.get('password')
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error('Failed to create user');

      // Refresh the users list after successful creation
      fetchUsers(currentPage);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-8 min-h-screen bg-gradient-to-br from-purple-900/60 to-cyan-900/60">
      <div className="backdrop-blur-sm bg-black/40 rounded-xl p-8 shadow-lg border border-cyan-500/50">
        <h1 className="text-4xl font-light mb-8 text-cyan-200">Users</h1>
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user.id} className="p-3 bg-black/60 rounded-lg backdrop-blur-sm shadow-sm border border-purple-500/50 hover:border-cyan-500/70 transition-colors">
              <span className="text-cyan-200">{user.name}</span>
              <span className="text-purple-200 text-sm ml-2">({user.email})</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          {meta && (
            <div className="flex items-center justify-center gap-4">
              <span className="text-cyan-200">
                Page {meta.page} of {meta.totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-cyan-200 hover:bg-purple-900/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-cyan-500/50 hover:border-purple-500/70"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))
                }
                disabled={currentPage === meta.totalPages}
                className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-cyan-200 hover:bg-purple-900/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-cyan-500/50 hover:border-purple-500/70"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-light mb-6 text-cyan-200">Add New User</h2>
          <form onSubmit={handleSubmit} className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/50">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-cyan-200">
                  <span className="flex items-center gap-2">
                    👤 Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full rounded-lg border border-cyan-500/50 bg-black/70 backdrop-blur-sm p-3 text-white focus:ring-2 focus:ring-purple-500/70 transition-all placeholder-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-cyan-200">
                  <span className="flex items-center gap-2">
                    👥 Surname
                  </span>
                </label>
                <input
                  type="text"
                  name="surname"
                  id="surname"
                  required
                  className="mt-1 block w-full rounded-lg border border-cyan-500/50 bg-black/70 backdrop-blur-sm p-3 text-white focus:ring-2 focus:ring-purple-500/70 transition-all placeholder-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyan-200">
                  <span className="flex items-center gap-2">
                    ✉️ Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full rounded-lg border border-cyan-500/50 bg-black/70 backdrop-blur-sm p-3 text-white focus:ring-2 focus:ring-purple-500/70 transition-all placeholder-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-cyan-200">
                  <span className="flex items-center gap-2">
                    ⭐️ Nickname
                  </span>
                </label>
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  className="mt-1 block w-full rounded-lg border border-cyan-500/50 bg-black/70 backdrop-blur-sm p-3 text-white focus:ring-2 focus:ring-purple-500/70 transition-all placeholder-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cyan-200">
                  <span className="flex items-center gap-2">
                    🔒 Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="mt-1 block w-full rounded-lg border border-cyan-500/50 bg-black/70 backdrop-blur-sm p-3 text-white focus:ring-2 focus:ring-purple-500/70 transition-all placeholder-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 rounded-lg bg-black/60 backdrop-blur-sm text-cyan-200 hover:bg-purple-900/70 transition-all border border-cyan-500/50 hover:border-purple-500/70 font-medium"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
