// src/app/components/FooterNav.tsx
"use client";
import React from "react";
import Link from "next/link";

export default function FooterNav() {
  return (
    <footer className="w-full py-6 px-6 bg-white dark:bg-gray-900 shadow-inner flex justify-center gap-6">
      <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
      <Link href="/depositCrypto" className="text-green-600 hover:underline">Deposit</Link>
      <Link href="/withdraw" className="text-red-600 hover:underline">Withdraw</Link>
      <Link href="/convert" className="text-purple-600 hover:underline">Convert</Link>
      <Link href="/transaction" className="text-orange-600 hover:underline">Transactions</Link>
      <Link href="/profile" className="text-gray-600 hover:underline">Profile</Link>
    </footer>
  );
}