"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

const loading = () => <Skeleton className="h-72 w-full" />;

export const BloodGroupBar = dynamic(() => import("./BloodGroupBar"), { ssr: false, loading });
export const TimeLine = dynamic(() => import("./TimeLine"), { ssr: false, loading });
export const StatusPie = dynamic(() => import("./StatusPie"), { ssr: false, loading });
