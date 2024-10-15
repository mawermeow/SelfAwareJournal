import { Button } from "@/components/ui/Button";

export const Hero = () => {
  return (
    <section className="bg-blue-500 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">自覺筆記</h1>
        <p className="text-lg mb-8">
          你的專屬療癒小精靈，通過心理測驗和意識流筆記，幫助你找到內心的平靜與力量。
        </p>
        <Button variant="secondary">了解更多</Button>
      </div>
    </section>
  );
};
