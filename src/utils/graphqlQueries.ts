		
export const PROBLEM_QUERY = `
  query getQuestionDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      titleSlug
      content
      difficulty
      likes
      dislikes
      topicTags {
        name
      }
      codeSnippets {
        lang
        langSlug
        code
      }
    }
  }
`;

export const SOLUTIONS_QUERY = `
  query questionSolutions($questionSlug: String!, $skip: Int!, $first: Int!, $orderBy: TopicSortingOption, $languageTags: [String!], $topicTags: [String!]) {
    questionSolutions(
      filters: {
        questionSlug: $questionSlug
        skip: $skip
        first: $first
        orderBy: $orderBy
        languageTags: $languageTags
        topicTags: $topicTags
      }
    ) {
      hasDirectResults
      totalNum
      solutions {
        id
        title
        commentCount
        topLevelCommentCount
        viewCount
        pinned
        isFavorite
        solutionTags {
          name
          slug
        }
        post {
          id
          status
          voteCount
          creationDate
          isHidden
          author {
            username
            isActive
            nameColor
            activeBadge {
              displayName
              icon
            }
            profile {
              userAvatar
              reputation
            }
          }
          authorIsModerator
          isOwnPost
          content
          updationDate
        }
      }
    }
  }
`;