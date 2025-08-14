export interface LeetCodeProblem {
  questionId: string;
  title: string;
  titleSlug: string;
  content: string;
  difficulty: string;
  likes: number;
  dislikes: number;
  topicTags: Array<{ name: string }>;
  codeSnippets: Array<{
    lang: string;
    langSlug: string;
    code: string;
  }>;
}

export interface LeetCodeSolution {
  id: string;
  title: string;
  commentCount: number;
  topLevelCommentCount: number;
  viewCount: number;
  pinned: boolean;
  isFavorite: boolean;
  solutionTags: Array<{ name: string; slug: string }>;
  post: {
    id: string;
    status: string;
    voteCount: number;
    creationDate: number;
    isHidden: boolean;
    author: {
      username: string;
      isActive: boolean;
      nameColor: string;
      activeBadge?: {
        displayName: string;
        icon: string;
      };
      profile: {
        userAvatar: string;
        reputation: number;
      };
    };
    authorIsModerator: boolean;
    isOwnPost: boolean;
    content: string;
    updationDate: number;
  };
}

export interface LeetCodeData {
  success: boolean;
  timestamp: string;
  problem: {
    slug: string;
    id: string;
    title: string;
    difficulty: string;
    description: string;
    cleanDescription: string;
    likes: number;
    dislikes: number;
    topicTags: string[];
    codeSnippets: Array<{
      language: string;
      langSlug: string;
      code: string;
    }>;
  };
  solutions: Array<{
    id: string;
    title: string;
    author: string;
    votes: number;
    views: number;
    commentCount: number;
    creationDate: string;
    tags: string[];
    content: string;
    cleanContent: string;
  }>;
  metadata: {
    totalSolutions: number;
    fetchedSolutions: number;
    sortedBy: string;
    processingTime: number;
  };
  error?: string;
}