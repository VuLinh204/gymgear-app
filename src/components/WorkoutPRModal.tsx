'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Share2, 
  X, 
  Dumbbell, 
  Sparkles, 
  Flame, 
  Calendar,
  Check,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { 
  UserPRRecord, 
  fetchUserPRs, 
  saveUserPR, 
  deleteUserPR, 
  createPost 
} from '@/lib/supabaseDB';
import { MOCK_EQUIPMENTS } from '@/data/mockData';

interface WorkoutPRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPRSharedToFeed?: () => void;
}

const COMMON_EXERCISES = [
  'Đẩy Ngực Ngang (Bench Press)',
  'Đạp Đùi Nghiêng (Leg Press)',
  'Gánh Tạ Đùi (Barbell Squat)',
  'Kéo Lưng Xô (Deadlift)',
  'Kéo Xô Đôi (Lat Pulldown)',
  'Đẩy Vai Đôi (Overhead Shoulder Press)',
  'Ép Ngực Máy (Pec Deck Fly)',
  'Cuốn Tay Trước (Bicep Curl)',
];

export default function WorkoutPRModal({
  isOpen,
  onClose,
  onPRSharedToFeed,
}: WorkoutPRModalProps) {
  const { currentUser, isGuest, requestAuth } = useAuth();
  const [prs, setPrs] = useState<UserPRRecord[]>([]);
  const [exerciseName, setExerciseName] = useState(COMMON_EXERCISES[0]);
  const [customExercise, setCustomExercise] = useState('');
  const [weightKg, setWeightKg] = useState<number | ''>(100);
  const [reps, setReps] = useState<number | ''>(1);
  const [notes, setNotes] = useState('');
  const [taggedEquipmentId, setTaggedEquipmentId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [sharingPRId, setSharingPRId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadPRs = async () => {
    const data = await fetchUserPRs();
    setPrs(data);
  };

  useEffect(() => {
    if (isOpen) {
      loadPRs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      requestAuth('login');
      return;
    }

    const finalExercise = customExercise.trim() || exerciseName;
    if (!finalExercise || !weightKg || Number(weightKg) <= 0) return;

    setIsAdding(true);
    try {
      const saved = await saveUserPR(
        finalExercise,
        Number(weightKg),
        Number(reps) || 1,
        notes.trim() || undefined,
        taggedEquipmentId || undefined
      );

      setPrs((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
      setNotes('');
      setCustomExercise('');
      setSuccessMsg(`Đã ghi nhận kỷ lục ${finalExercise}: ${weightKg}kg!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUserPR(id);
    setPrs((prev) => prev.filter((p) => p.id !== id));
  };

  const handleShareToFeed = async (pr: UserPRRecord) => {
    if (isGuest) {
      requestAuth('login');
      return;
    }

    setSharingPRId(pr.id);
    try {
      const shareContent = `🏆 KỶ LỤC CÁ NHÂN MỚI (PR BREAKTHROUGH)!\n\n💪 Bài tập: ${pr.exerciseName}\n🔥 Mức tạ: ${pr.weightKg} kg (${pr.reps} reps)\n${pr.notes ? `📝 Ghi chú: "${pr.notes}"\n` : ''}\n#GymGear #PR #KỷLụcCáNhân #GymMotivation`;

      const ok = await createPost(
        currentUser.id,
        shareContent,
        5,
        pr.equipmentId || undefined
      );

      if (ok) {
        setSuccessMsg(`Đã chia sẻ thành tích ${pr.weightKg}kg lên Bảng tin cộng đồng!`);
        onPRSharedToFeed?.();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } finally {
      setSharingPRId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-orange-500/20">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Nhật Ký Kỷ Lục Cá Nhân (PR Tracker)
              </h2>
              <p className="text-xs text-slate-400">
                Ghi nhận mức tạ tối đa & chia sẻ thành tích bứt phá với cộng đồng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Thông báo thành công nếu có */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form thêm PR mới */}
          <form onSubmit={handleSavePR} className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-orange-400" /> Thêm Mốc Kỷ Lục Mới
              </span>
              <span className="text-[10px] text-slate-500">Tự động lưu vào hồ sơ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Tên bài tập */}
              <div className="sm:col-span-7">
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Bài tập chính
                </label>
                <select
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  {COMMON_EXERCISES.map((ex, i) => (
                    <option key={i} value={ex}>
                      {ex}
                    </option>
                  ))}
                  <option value="custom">-- Bài tập khác (tự nhập) --</option>
                </select>

                {exerciseName === 'custom' && (
                  <input
                    type="text"
                    placeholder="Nhập tên bài tập..."
                    value={customExercise}
                    onChange={(e) => setCustomExercise(e.target.value)}
                    className="w-full mt-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    required
                  />
                )}
              </div>

              {/* Mức tạ kg */}
              <div className="sm:col-span-3">
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Mức tạ (Kg)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Số reps */}
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Reps
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={reps}
                  onChange={(e) => setReps(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Ghi chú & Đính kèm máy */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <input
                  type="text"
                  placeholder="Ghi chú cảm xúc, form tập, người hỗ trợ..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-5">
                <select
                  value={taggedEquipmentId}
                  onChange={(e) => setTaggedEquipmentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                >
                  <option value="">-- Gắn thẻ máy tập (Tùy chọn) --</option>
                  {MOCK_EQUIPMENTS.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isAdding}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold transition shadow-md flex items-center gap-1.5"
              >
                {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Lưu Kỷ Lục PR
              </button>
            </div>
          </form>

          {/* Danh sách các kỷ lục đã đạt được */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Bảng Thành Tích Cá Nhân ({prs.length})
            </h3>

            {prs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prs.map((pr) => {
                  const eq = pr.equipmentId
                    ? MOCK_EQUIPMENTS.find((e) => e.id === pr.equipmentId)
                    : null;

                  return (
                    <div
                      key={pr.id}
                      className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-xl flex flex-col justify-between transition-all group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {pr.exerciseName}
                          </span>
                          <button
                            onClick={() => handleDelete(pr.id)}
                            className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                            title="Xóa kỷ lục này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                            {pr.weightKg} <span className="text-xs text-slate-400 font-bold">KG</span>
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            • {pr.reps} {pr.reps > 1 ? 'reps' : 'rep (1RM)'}
                          </span>
                        </div>

                        {pr.notes && (
                          <p className="text-[11px] text-slate-300 italic line-clamp-2 mb-2">
                            "{pr.notes}"
                          </p>
                        )}

                        {eq && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md mb-2">
                            <Dumbbell className="w-2.5 h-2.5" /> {eq.name}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(pr.achievedAt).toLocaleDateString('vi-VN')}
                        </span>

                        <button
                          onClick={() => handleShareToFeed(pr)}
                          disabled={sharingPRId === pr.id}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 text-[11px] font-semibold transition flex items-center gap-1"
                        >
                          {sharingPRId === pr.id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                          ) : (
                            <Share2 className="w-3 h-3 text-amber-400" />
                          )}
                          Chia sẻ Feed
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-semibold">Chưa có kỷ lục PR nào</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Nhập mức tạ lớn nhất của bạn ở trên để bắt đầu theo dõi!</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Kỷ lục cá nhân giúp bạn duy trì động lực tập luyện mỗi ngày.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
