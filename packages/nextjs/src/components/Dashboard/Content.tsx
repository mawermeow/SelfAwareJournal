import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const DashboardContent = () => {
  return (
    <main className="p-6 bg-gray-100 flex-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/tests">
          <div className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50">
            <h3 className="text-xl font-bold mb-2">心理測驗</h3>
            <p className="text-gray-600">了解你的性格與特質</p>
            <Button
              className="mt-4"
              variant="primary"
            >
              開始測驗
            </Button>
          </div>
        </Link>
        <Link href="/dashboard/journal">
          <div className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50">
            <h3 className="text-xl font-bold mb-2">意識流筆記</h3>
            <p className="text-gray-600">記錄未經整理的想法</p>
            <Button
              className="mt-4"
              variant="primary"
            >
              開始記錄
            </Button>
          </div>
        </Link>
        <Link href="/dashboard/analysis">
          <div className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50">
            <h3 className="text-xl font-bold mb-2">分析報告</h3>
            <p className="text-gray-600">查看你的情緒和思維分析</p>
            <Button
              className="mt-4"
              variant="primary"
            >
              查看報告
            </Button>
          </div>
        </Link>
      </div>
    </main>
  );
};
