import React, { useState } from 'react';
import { 
  MessageSquare, ThumbsUp, Plus, Sparkles, User, 
  Send, Tag, Filter, X 
} from 'lucide-react';
import { DiscussionPost, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';

interface DiscussionsViewProps {
  currentUser: UserProfile;
  initialDiscussionId?: string;
  onNavigateProfile: (userId: string) => void;
}

export const DiscussionsView: React.FC<DiscussionsViewProps> = ({
  currentUser,
  initialDiscussionId,
  onNavigateProfile
}) => {
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(StorageService.getDiscussions());
  const [selectedPostId, setSelectedPostId] = useState<string | null>(initialDiscussionId || null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'helpful'>('popular');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // Form states for new post
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Patterns, Interview');

  const selectedPost = discussions.find(d => d.id === selectedPostId);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = StorageService.toggleLikeDiscussion(id);
    if (updated) {
      setDiscussions(StorageService.getDiscussions());
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedPostId) return;
    const updated = StorageService.addComment(selectedPostId, commentInput);
    if (updated) {
      setDiscussions(StorageService.getDiscussions());
      setCommentInput('');
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    StorageService.addDiscussion({
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        levelTitle: currentUser.levelTitle
      }
    });

    setDiscussions(StorageService.getDiscussions());
    setIsCreatingPost(false);
    setNewTitle('');
    setNewContent('');
  };

  // Sort discussions
  const sortedDiscussions = [...discussions].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'helpful') return b.commentsCount - a.commentsCount;
    return 0; // Default latest order
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <span className="lumen-tag text-purple-400">Peer Exchange</span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Discussions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Share problem breakdowns, review interview debriefs, and discuss optimal approaches.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPost(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="h-4 w-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white/40 mr-1">Sort by:</span>
        {[
          { id: 'popular', label: 'Popular' },
          { id: 'latest', label: 'Latest' },
          { id: 'helpful', label: 'Most Helpful' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSortBy(s.id as any)}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              sortBy === s.id
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Discussions Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Posts List */}
        <div className="lg:col-span-7 space-y-4">
          {sortedDiscussions.map((post) => {
            const isSelected = post.id === selectedPostId;
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className={`glass-panel cursor-pointer rounded-3xl p-6 border transition-all ${
                  isSelected
                    ? 'border-purple-400/50 bg-purple-500/5 shadow-lg shadow-purple-500/10'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div 
                    onClick={(e) => { e.stopPropagation(); onNavigateProfile(post.author.id); }}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
                    />
                    <span className="text-xs font-semibold text-white">{post.author.name}</span>
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-amber-400 font-medium">
                      {post.author.levelTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/40">{post.createdAt}</span>
                </div>

                {/* Title */}
                <h3 className="mt-3 font-display text-base font-bold text-white leading-snug">
                  {post.title}
                </h3>

                {/* Snippet */}
                <p className="mt-2 line-clamp-2 text-xs text-white/65 leading-relaxed">
                  {post.content}
                </p>

                {/* Tags and Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t, idx) => (
                      <span key={idx} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.hasLiked ? 'text-amber-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${post.hasLiked ? 'fill-amber-400' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{post.commentsCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Post Thread & Comments (Right Column) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.1] bg-[#0c0c11] sticky top-24 space-y-6">
          {selectedPost ? (
            <>
              <div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="font-semibold text-white">{selectedPost.author.name}</span>
                  <span>· {selectedPost.createdAt}</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-bold text-white">
                  {selectedPost.title}
                </h2>
                <div className="mt-4 text-xs leading-relaxed text-white/80 whitespace-pre-wrap">
                  {selectedPost.content}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-white/[0.08] pt-4 space-y-4">
                <span className="text-xs font-bold text-white">
                  Comments ({selectedPost.comments.length})
                </span>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {selectedPost.comments.map((c) => (
                    <div key={c.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-white/90">{c.author.name}</span>
                        <span className="text-white/40">{c.createdAt}</span>
                      </div>
                      <p className="text-white/70 leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a constructive response..."
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-400 px-3.5 py-2 text-black hover:bg-amber-300"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-white/40">
              Select a discussion thread on the left to read and participate in comments.
            </div>
          )}
        </div>

      </div>

      {/* New Discussion Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className="glass-panel relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                Start a New Discussion
              </h3>
              <button onClick={() => setIsCreatingPost(false)} className="text-white/50 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Invariant analysis for 3Sum"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Content (Markdown supported)</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share your reasoning, solution tradeoffs, or interview debrief..."
                  rows={6}
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] p-3.5 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Patterns, Dynamic Programming, Meta"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
