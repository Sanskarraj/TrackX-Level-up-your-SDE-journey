"use client";

import { logout } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

const HeaderUserInfo = ({ user }: { user: any }) => {
  const [confirming, setConfirming] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const triggerLogout = async () => {
    setLoggingOut(true);
    setStatusMessage("Logging out...");
    await new Promise((res) => setTimeout(res, 2000));
    await logout();
    router.push("/signin");
  };

  const handleClick = () => {
    if (loggingOut) return;

    if (hovered) {
      // Handle double click on hover
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
        triggerLogout();
      } else {
        setStatusMessage("Double click to logout");
        clickTimeout.current = setTimeout(() => {
          clickTimeout.current = null;
          setStatusMessage(null);
        }, 400); // Allow time for double click
      }
    } else {
      // Single click confirmation logic
      if (!confirming) {
        setConfirming(true);
        setStatusMessage("Click again to logout");
        clickTimeout.current = setTimeout(() => {
          setConfirming(false);
          setStatusMessage(null);
          clickTimeout.current = null;
        }, 3000);
      } else {
        triggerLogout();
      }
    }
  };

  // Reset message on mouse leave
  useEffect(() => {
    if (!hovered && !confirming && !loggingOut) {
      setStatusMessage(null);
    }
  }, [hovered, confirming, loggingOut]);

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => {
        setHovered(true);
        if (!loggingOut && !confirming) {
          setStatusMessage("Double click to logout");
        }
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (!confirming && !loggingOut) {
          setStatusMessage(null);
        }
      }}
      disabled={loggingOut}
      className={clsx(
        "relative flex items-center space-x-3 px-4 py-2 rounded-lg border text-white transition-all duration-300",
        loggingOut
          ? "bg-red-600 border-red-400 animate-pulse"
          : confirming
          ? "bg-yellow-500 border-yellow-300"
          : "border-gray-700 hover:bg-gray-700"
      )}
    >
      {user?.image && (
        <Image
          src={user.image}
          alt="User Image"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      )}
      <span className="text-sm font-medium">
        {statusMessage || user?.name || "User"}
      </span>

      {/* Red border ping animation */}
      {loggingOut && (
        <span className="absolute inset-0 rounded-lg border-2 border-red-400 animate-ping pointer-events-none"></span>
      )}
    </button>
  );
};

export default HeaderUserInfo;
