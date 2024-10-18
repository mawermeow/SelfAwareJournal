import { drizzleDB, tablePersonalityTests } from "..";

export default function () {
  return drizzleDB
    .insert(tablePersonalityTests)
    .values([
      {
        name: "本能性格",
        description:
          "這是一種更原始的驅動力，超越了人格。它影響的是人類在面對生存、繁殖和社交需求時的直接反應。從九型人格的角度看，個人的本能驅動會塑造和強化其人格，這意味著同一型別的人會因不同的本能傾向而表現出不同的行為模式。",
      },
      {
        name: "MBTI",
        description:
          "MBTI側重的是人們如何感知世界並作出決策，描述的是我們達成目標的方式和處理事情的手段。MBTI基於四個維度（內向/外向、感覺/直覺、思考/情感、判斷/知覺），這些維度展示了我們的思考模式和行為風格。",
      },
      {
        name: "九型人格",
        description:
          "這是一種描述人類行為背後驅動力的系統。九型人格分為九種基本的性格類型，每一類型的人都有不同的核心動機，這些動機引導他們的行為和生活目標。九型人格重視探索個人深層的驅動力與情感反應，幫助理解我們為什麼以某種方式行事。",
      },
    ])
    .onConflictDoNothing();
}
