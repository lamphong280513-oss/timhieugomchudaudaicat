import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, Plus, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityPost } from '../types';
import { api } from '../services/api';

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: 'Người dùng ẩn danh', imageUrl: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getCommunity();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching community posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await api.createCommunityPost(newPost);
      setPosts([{ ...newPost, id, createdAt: new Date().toISOString() }, ...posts]);
      setShowModal(false);
      setNewPost({ title: '', content: '', author: 'Người dùng ẩn danh', imageUrl: '' });
    } catch (err) {
      alert("Lỗi khi đăng bài. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cộng đồng Chu Đậu</h2>
          <p className="text-slate-500 font-medium">Nơi chia sẻ đam mê và kiến thức về di sản Việt.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="p-4 gradient-bg text-white rounded-2xl shadow-xl shadow-emerald-200 hover:scale-110 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <div className="space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-bold">Đang tải thảo luận...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Chưa có thảo luận</h3>
            <p className="text-slate-400 text-sm mt-2">Hãy là người đầu tiên khơi dậy cuộc trò chuyện!</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-[2.5rem] overflow-hidden border-transparent hover:shadow-2xl transition-all group"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-blue-500/20 flex items-center justify-center text-emerald-700 font-black text-xl border border-white">
                    {post.author[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                      {post.author}
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Thành viên</span>
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">{new Date(post.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-emerald-700 transition-colors">{post.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-medium mb-6">{post.content}</p>
                {post.imageUrl && (
                  <div className="rounded-3xl overflow-hidden mb-6 aspect-[16/9] bg-slate-50 border border-slate-100 shadow-inner">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                  <button className="flex items-center gap-2.5 text-slate-500 hover:text-red-500 transition-all group/btn">
                    <div className="p-2 rounded-xl group-hover/btn:bg-red-50 transition-colors">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black">24</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-slate-500 hover:text-blue-500 transition-all group/btn">
                    <div className="p-2 rounded-xl group-hover/btn:bg-blue-50 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black">8</span>
                  </button>
                  <button className="ml-auto p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Chia sẻ di sản</h3>
                  <p className="text-slate-400 text-sm font-medium">Lan tỏa vẻ đẹp của gốm Chu Đậu đến mọi người.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề bài viết</label>
                    <input
                      required
                      type="text"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold transition-all"
                      placeholder="VD: Bình Tỳ Bà rồng phượng thế kỷ XV"
                      value={newPost.title}
                      onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cảm nhận của bạn</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none font-medium leading-relaxed transition-all"
                      placeholder="Chia sẻ ý nghĩa hoặc câu chuyện về hiện vật..."
                      value={newPost.content}
                      onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Link hình ảnh di sản</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium transition-all"
                        placeholder="Dán link ảnh tại đây (Google Drive, Imgur...)"
                        value={newPost.imageUrl}
                        onChange={e => setNewPost({ ...newPost, imageUrl: e.target.value })}
                      />
                      <button type="button" className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-colors">
                        <ImageIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 gradient-bg text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-emerald-200"
                  >
                    <Send className="w-5 h-5" />
                    Đăng bài ngay
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
