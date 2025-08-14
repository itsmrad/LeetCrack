import type { LeetCodeData } from "@/types/leetcodeTypes";

export function prepareAIInput(data: LeetCodeData) {
  if (!data.success) return null;
  return {
    problem: {
      title: data.problem.title,
      difficulty: data.problem.difficulty,
      description: data.problem.cleanDescription,
      tags: data.problem.topicTags,
    },
    solutions: data.solutions.map((sol) => ({
      title: sol.title,
      author: sol.author,
      votes: sol.votes,
      views: sol.views,
      tags: sol.tags,
      content: sol.cleanContent.length > 2000
        ? sol.cleanContent.slice(0, 2000) + "..."
        : sol.cleanContent,
    })),
  };
}