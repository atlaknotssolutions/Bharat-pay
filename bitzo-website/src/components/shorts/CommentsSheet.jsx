import { X } from "lucide-react";

export default function CommentsSheet({
  comments,
  text,
  loading,
  onTextChange,
  onSubmit,
  onClose,
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 p-4 text-white backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Comments</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close comments"
          className="rounded-full p-1.5 transition hover:bg-white/10 active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="mb-3">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={2}
          placeholder="Write a comment..."
          aria-label="Write a comment"
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none focus:bg-white/15"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Posting..." : "Comment"}
          </button>
        </div>
      </form>

      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="rounded-lg bg-white/10 p-2 text-sm">
              <p className="font-medium text-white/90">
                {comment.userName || "User"}
              </p>
              <p className="mt-1 text-white/80">{comment.text}</p>
              <p className="mt-1 text-[11px] text-white/50">
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleString()
                  : "Just now"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/70">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
