export const Features = () => {
  const features = [
    {
      title: "心理測驗",
      description: "通過科學的心理測驗了解自己的性格和特質。",
      icon: "🧠",
    },
    {
      title: "意識流筆記",
      description: "隨時隨地記錄未經整理的想法，釋放內心壓力。",
      icon: "📝",
    },
    {
      title: "AI 分析",
      description: "利用 AI 技術分析你的情緒和思維，提供反思與建議。",
      icon: "🤖",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center p-4 border rounded-lg shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
