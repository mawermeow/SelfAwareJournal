import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/Landing/Hero";
import { Features } from "@/components/Landing/Features";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Hero />
      <Features />
      <div className="flex justify-center mt-12">
        <Link href="/auth/login">
          <Button variant="primary">立即開始</Button>
        </Link>
      </div>
    </div>
  );
}
