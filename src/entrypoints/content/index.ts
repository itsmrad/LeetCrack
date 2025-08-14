import type { LeetCodeProblem, LeetCodeSolution, LeetCodeData } from "@/types/leetcodeTypes";
import { PROBLEM_QUERY, SOLUTIONS_QUERY } from "@/utils/graphqlQueries";

export default defineContentScript({
	matches: ["https://leetcode.com/*"],
	main: async function () {
		console.log("Content script running on LeetCode!");

		// Constants
		const GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";
		const DEFAULT_HEADERS = {
			"Content-Type": "application/json",
			"User-Agent":
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
		} as const;

		// Utility functions
		const cleanHtmlContent = (content: string): string => {
			return (
				content
					?.replace(/<[^>]*>/g, "")
					.replace(/&nbsp;/g, " ")
					.replace(/&lt;/g, "<")
					.replace(/&gt;/g, ">") || ""
			);
		};

		const formatDate = (timestamp: number): string => {
			return new Date(timestamp * 1000).toISOString();
		};

		const extractProblemSlug = (pathname: string): string | null => {
			const match = pathname.match(/^\/problems\/([^/]+)\/?/);
			return match ? match[1] : null;
		};

		// API functions
		const fetchGraphQL = async (
			query: string,
			variables: Record<string, any>
		): Promise<any> => {
			const response = await fetch(GRAPHQL_ENDPOINT, {
				method: "POST",
				headers: DEFAULT_HEADERS,
				body: JSON.stringify({ query, variables }),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return response.json();
		};

		const fetchProblemData = async (
			titleSlug: string
		): Promise<LeetCodeProblem | null> => {
			try {
				const data = await fetchGraphQL(PROBLEM_QUERY, { titleSlug });

				if (data.errors) {
					console.warn("GraphQL errors in problem query:", data.errors);
					return null;
				}

				return data.data?.question || null;
			} catch (error) {
				console.error("Failed to fetch problem data:", error);
				return null;
			}
		};

		const fetchSolutionsData = async (
			titleSlug: string,
			limit: number = 10
		): Promise<LeetCodeSolution[]> => {
			try {
				const data = await fetchGraphQL(SOLUTIONS_QUERY, {
					questionSlug: titleSlug,
					skip: 0,
					first: limit,
					orderBy: "most_votes",
					languageTags: [],
					topicTags: [],
				});

				if (data.errors) {
					console.warn("GraphQL errors in solutions query:", data.errors);
					return [];
				}

				return data.data?.questionSolutions?.solutions || [];
			} catch (error) {
				console.error("Failed to fetch solutions data:", error);
				return [];
			}
		};

		// Main processing function
		const processLeetCodeData = async (
			titleSlug: string
		): Promise<LeetCodeData> => {
			const startTime = performance.now();
			const timestamp = new Date().toISOString();

			try {
				// Fetch problem and solutions data concurrently
				const [problemData, solutionsData] = await Promise.all([
					fetchProblemData(titleSlug),
					fetchSolutionsData(titleSlug, 10),
				]);

				if (!problemData) {
					return {
						success: false,
						timestamp,
						problem: {} as any,
						solutions: [],
						metadata: {
							totalSolutions: 0,
							fetchedSolutions: 0,
							sortedBy: "most_votes",
							processingTime: performance.now() - startTime,
						},
						error: "Failed to fetch problem data",
					};
				}

				// Sort solutions by view count (descending) and take top 3
				const sortedSolutions = solutionsData
					.sort((a, b) => b.viewCount - a.viewCount)
					.slice(0, 3);

				// Process and structure the data
				const result: LeetCodeData = {
					success: true,
					timestamp,
					problem: {
						slug: titleSlug,
						id: problemData.questionId,
						title: problemData.title,
						difficulty: problemData.difficulty,
						description: problemData.content,
						cleanDescription: cleanHtmlContent(problemData.content),
						likes: problemData.likes,
						dislikes: problemData.dislikes,
						topicTags: problemData.topicTags.map((tag) => tag.name),
						codeSnippets: problemData.codeSnippets.map((snippet) => ({
							language: snippet.lang,
							langSlug: snippet.langSlug,
							code: snippet.code,
						})),
					},
					solutions: sortedSolutions.map((solution) => ({
						id: solution.id,
						title: solution.title,
						author: solution.post.author.username,
						votes: solution.post.voteCount,
						views: solution.viewCount,
						commentCount: solution.commentCount,
						creationDate: formatDate(solution.post.creationDate),
						tags: solution.solutionTags.map((tag) => tag.name),
						content: solution.post.content,
						cleanContent: cleanHtmlContent(solution.post.content),
					})),
					metadata: {
						totalSolutions: solutionsData.length,
						fetchedSolutions: sortedSolutions.length,
						sortedBy: "views_desc",
						processingTime:
							Math.round((performance.now() - startTime) * 100) / 100,
					},
				};

				return result;
			} catch (error) {
				return {
					success: false,
					timestamp,
					problem: {} as any,
					solutions: [],
					metadata: {
						totalSolutions: 0,
						fetchedSolutions: 0,
						sortedBy: "most_votes",
						processingTime: performance.now() - startTime,
					},
					error:
						error instanceof Error ? error.message : "Unknown error occurred",
				};
			}
		};

		try {
			// Extract problem slug from URL
			const titleSlug = extractProblemSlug(window.location.pathname);

			if (!titleSlug) {
				console.log("ℹ️ Not on a LeetCode problem page");
				return;
			}

			console.log(`🎯 Processing problem: ${titleSlug}`);

			// Process LeetCode data
			const leetcodeData = await processLeetCodeData(titleSlug);

			// Log the structured JSON data
			console.log("📊 LeetCode Data (Structured JSON):");
			console.log(JSON.stringify(leetcodeData, null, 2));

			// Log summary for quick reference
			if (leetcodeData.success) {
				console.log("\n✅ Successfully processed LeetCode data:");
				console.log(
					`📝 Problem: ${leetcodeData.problem.title} (${leetcodeData.problem.difficulty})`
				);
				console.log(`🏷️ Tags: ${leetcodeData.problem.topicTags.join(", ")}`);
				console.log(`💡 Solutions: ${leetcodeData.solutions.length} fetched`);
				console.log(
					`⏱️ Processing time: ${leetcodeData.metadata.processingTime}ms`
				);

				leetcodeData.solutions.forEach((solution, index) => {
					console.log(
						`  ${index + 1}. "${solution.title}" by ${
							solution.author
						} (${solution.views.toLocaleString()} views, ${
							solution.votes
						} votes)`
					);
				});
			} else {
				console.error(
					"❌ Failed to process LeetCode data:",
					leetcodeData.error
				);
			}
		} catch (error) {
			console.error("💥 Content script error:", error);
		}
	},
});
