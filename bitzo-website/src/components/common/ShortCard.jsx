export default function ShortCard({ item, onClick }) {
  return (
    <div onClick={() => onClick(item)} className="cursor-pointer group">
      <div className="relative aspect-video rounded-md overflow-hidden mb-2">
        <img
          src={
            item.thumbnail ||
            item.thumb ||
            "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop"
          }
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs">
          #{item.id % 10 || 1}
        </div>
      </div>
      <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
      <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
        <span>{Number(item.views || 0).toLocaleString()} views</span>
        <span>{Number(item.likes || 0).toLocaleString()} likes</span>
      </div>
    </div>
  );
}
