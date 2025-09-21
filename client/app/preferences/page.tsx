"use client";

import Header from "@/app/components/Header";
import { useSelector } from "react-redux";

export default function PreferencesPage() {
  const isAuth = useSelector((state: any) => state.auth.isAuth);
  return (
    <>
      <Header isLoggedin={isAuth} />
      <main className="container mx-auto py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Preferences</h1>
        <p className="text-gray-600">This page is under construction. Come back soon!</p>
      </main>
    </>
  );
}