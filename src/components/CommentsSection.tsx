import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";
import { Comment, User, CommentVote } from "@prisma/client";

type CommentWithRelations = Comment & {
  author: User;
  votes: CommentVote[];
  replies: (Comment & {
    author: User;
    votes: CommentVote[];
  })[];
};

interface CommentsSectionProps {
  postId: string;
}

export default async function CommentsSection({
  postId,
}: CommentsSectionProps) {
  const session = await getAuthSession();

  let comments: CommentWithRelations[] = [];
  try {
    // Query all comments for the post first
    const allComments = await db.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });
    
    console.log(`Fetched ${allComments.length} total comments for post ${postId}`);
    
    // Filter for top-level comments (where replyToId is null or undefined)
    const topLevelComments = allComments.filter(
      (comment) => !comment.replyToId || comment.replyToId === null
    );
    
    // Get replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await db.comment.findMany({
          where: {
            postId,
            replyToId: comment.id,
          },
          include: {
            author: true,
            votes: true,
          },
        });
        
        return {
          ...comment,
          replies,
        } as CommentWithRelations;
      })
    );
    
    comments = commentsWithReplies;
    console.log(`Processed ${comments.length} top-level comments with replies`);
  } catch (error) {
    console.error("Error fetching comments:", error);
  }

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments && comments.length > 0 ? (
          comments
            .filter((comment) => !comment.replyToId)
            .map((topLevelcomment) => {
            const topLevelcommentVotesAmt = (topLevelcomment.votes || []).reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );

            const topLevelcommentVote = (topLevelcomment.votes || []).find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topLevelcomment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment 
                  postId={postId}
                  votesAmt={topLevelcommentVotesAmt}
                  currentVote={topLevelcommentVote}
                  comment={topLevelcomment} />
                </div>
                {(topLevelcomment.replies || []).sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0)).map((reply) => {
                  const replyVotesAmt = (reply.votes || []).reduce(
                    (acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    },
                    0
                  );

                  const replyVote = (reply.votes || []).find(
                    (vote) => vote.userId === session?.user.id
                  );
                  return <div key={reply.id} className="ml-2 py-2 pl-4 border-l-2 border-zinc-200">
                    <PostComment comment={reply} currentVote={replyVote} votesAmt={replyVotesAmt} postId={postId}/>
                  </div>
                })}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-zinc-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
