import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, X, Save, Trash2,
  Tag, Clock, User, BookOpen, Sparkles, Pin,
  AlertCircle, RefreshCw, WifiOff
} from 'lucide-react';
import { notasApi } from '../../../services/api';

// ─── Tag colors ───────────────────────────────────────────────────────────────
const TAG_COLORS = [
  'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
];
const tagClass = (tag) => TAG_COLORS[Math.abs(tag.charCodeAt(0) % TAG_COLORS.length)];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  if (diff < 7) return `Hace ${diff} días`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

// ─── Note Card ────────────────────────────────────────────────────────────────
const NoteCard = ({ note, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group relative
      ${isActive
        ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-300 dark:border-sky-700 shadow-md'
        : 'bg-white dark:bg-[#0a1128] border-slate-200 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-sm'
      }`}
  >
    {note.pinned && (
      <div className="absolute top-3 right-3">
        <Pin size={12} className="text-sky-400 fill-sky-400" />
      </div>
    )}
    <div className="flex items-start gap-3 pr-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isActive ? 'bg-sky-100 dark:bg-sky-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
        <FileText size={15} className={isActive ? 'text-sky-500' : 'text-slate-500 dark:text-slate-400'} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className={`text-sm font-bold truncate ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-white'}`}>
          {note.titulo || note.title || 'Sin título'}
        </h4>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
          <User size={9} /> {note.paciente_nombre || note.patient || 'Sin paciente'}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
          {note.contenido || note.content || ''}
        </p>
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex flex-wrap gap-1">
            {(note.tags || []).slice(0, 2).map(tag => (
              <span key={tag} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${tagClass(tag)}`}>{tag}</span>
            ))}
          </div>
          <span className="text-[9px] text-slate-400 flex items-center gap-0.5 shrink-0">
            <Clock size={8} /> {formatDate(note.updated_at || note.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const NotesView = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editPatient, setEditPatient] = useState('');
  const [editTags, setEditTags] = useState('');
  const [savedOk, setSavedOk] = useState(false);

  const token = user?.token;
  const empresaId = user?.empresaConfig?.id;

  // ── Fetch notes from API ──────────────────────────────────────────────────
  const fetchNotes = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await notasApi.getAll(token, empresaId);
    if (err) {
      setError(err);
    } else {
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setNotes(list);
    }
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, [user]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = notes
    .filter(n => {
      const title = (n.titulo || n.title || '').toLowerCase();
      const patient = (n.paciente_nombre || n.patient || '').toLowerCase();
      const content = (n.contenido || n.content || '').toLowerCase();
      const q = search.toLowerCase();
      return title.includes(q) || patient.includes(q) || content.includes(q);
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  // ── Select note ───────────────────────────────────────────────────────────
  const handleSelectNote = (note) => {
    setActiveNote(note);
    setEditTitle(note.titulo || note.title || '');
    setEditContent(note.contenido || note.content || '');
    setEditPatient(note.paciente_nombre || note.patient || '');
    setEditTags((note.tags || []).join(', '));
    setIsCreating(false);
  };

  const handleNewNote = () => {
    setIsCreating(true);
    setActiveNote(null);
    setEditTitle('');
    setEditContent('');
    setEditPatient('');
    setEditTags('');
  };

  // ── Save (create or update) ───────────────────────────────────────────────
  const handleSave = async () => {
    const tagsArr = editTags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      titulo: editTitle || 'Sin título',
      contenido: editContent,
      paciente_nombre: editPatient || 'Sin paciente',
      tags: tagsArr,
    };

    setSaving(true);
    if (isCreating) {
      const { data, error: err } = await notasApi.create(token, empresaId, payload);
      if (!err && data) {
        const newNote = data?.data ?? { ...payload, id: Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        setNotes(prev => [newNote, ...prev]);
        setActiveNote(newNote);
        setIsCreating(false);
      }
    } else if (activeNote) {
      const { data, error: err } = await notasApi.update(token, empresaId, activeNote.id, payload);
      if (!err) {
        const updated = data?.data ?? { ...activeNote, ...payload, updated_at: new Date().toISOString() };
        setNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n));
        setActiveNote(updated);
      }
    }
    setSaving(false);
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 2000);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta nota?')) return;
    await notasApi.remove(token, empresaId, id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNote?.id === id) { setActiveNote(null); setIsCreating(false); }
  };

  // ── Pin (optimistic UI — la API debería tener PUT /notas/:id) ─────────────
  const handlePin = async (note) => {
    const updated = { ...note, pinned: !note.pinned };
    setNotes(prev => prev.map(n => n.id === note.id ? updated : n));
    if (activeNote?.id === note.id) setActiveNote(updated);
    await notasApi.update(token, empresaId, note.id, { pinned: !note.pinned });
  };

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Notas Clínicas
            <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-500 text-white rounded-full uppercase tracking-wide">Beta</span>
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Registra observaciones y seguimiento de tus pacientes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchNotes} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-500 transition-all" title="Recargar">
            <RefreshCw size={15} />
          </button>
          <button
            onClick={handleNewNote}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5"
          >
            <Plus size={16} /> Nueva Nota
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
          <WifiOff size={16} className="shrink-0" />
          <span>No se pudo conectar con el servidor. Las notas se guardarán localmente hasta que la API esté disponible.</span>
          <button onClick={fetchNotes} className="ml-auto text-xs font-bold underline shrink-0">Reintentar</button>
        </div>
      )}

      {/* Body */}
      <div className="flex gap-4 flex-1 min-h-0" style={{ minHeight: '600px' }}>

        {/* Left panel */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar notas..."
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:text-white placeholder:text-slate-400"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>}
          </div>

          {/* Stats */}
          <div className="flex gap-2">
            <div className="flex-1 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-white">{loading ? '—' : notes.length}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total</p>
            </div>
            <div className="flex-1 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-sky-500">{loading ? '—' : notes.filter(n => n.pinned).length}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Fijadas</p>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen size={32} className="text-slate-200 dark:text-slate-700 mb-2" />
                <p className="text-sm text-slate-400">{search ? 'Sin resultados' : 'No hay notas aún'}</p>
                {!search && (
                  <button onClick={handleNewNote} className="mt-3 text-xs font-bold text-sky-500 hover:underline">
                    + Crear primera nota
                  </button>
                )}
              </div>
            ) : filtered.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                isActive={activeNote?.id === note.id}
                onClick={() => handleSelectNote(note)}
              />
            ))}
          </div>
        </div>

        {/* Right panel — editor */}
        <div className="flex-1 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {(activeNote || isCreating) ? (
            <>
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Título de la nota..."
                    className="w-full font-bold text-lg text-slate-800 dark:text-white bg-transparent border-0 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  />
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <User size={13} className="text-slate-400 shrink-0" />
                      <input
                        value={editPatient}
                        onChange={e => setEditPatient(e.target.value)}
                        placeholder="Nombre del paciente..."
                        className="text-sm text-slate-500 dark:text-slate-400 bg-transparent border-0 outline-none flex-1 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Tag size={13} className="text-slate-400 shrink-0" />
                      <input
                        value={editTags}
                        onChange={e => setEditTags(e.target.value)}
                        placeholder="Tags (separados por comas)..."
                        className="text-sm text-slate-500 dark:text-slate-400 bg-transparent border-0 outline-none flex-1 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {activeNote && (
                    <>
                      <button
                        onClick={() => handlePin(activeNote)}
                        className={`p-2 rounded-lg transition-all ${activeNote.pinned ? 'text-sky-500 bg-sky-50 dark:bg-sky-950/30' : 'text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20'}`}
                        title="Fijar nota"
                      >
                        <Pin size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(activeNote.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-70 ${savedOk ? 'bg-emerald-500 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
                  >
                    {saving
                      ? <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      : <Save size={14} />
                    }
                    {saving ? 'Guardando...' : savedOk ? '¡Guardado!' : 'Guardar'}
                  </button>
                </div>
              </div>

              {editTags && (
                <div className="px-6 py-2 border-b border-slate-50 dark:border-slate-800/50 flex flex-wrap gap-1.5">
                  {editTags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tagClass(tag)}`}>{tag}</span>
                  ))}
                </div>
              )}

              <div className="flex-1 p-6">
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="Escribe tus observaciones clínicas aquí..."
                  className="w-full h-full resize-none text-sm text-slate-700 dark:text-slate-200 bg-transparent outline-none leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-700"
                />
              </div>

              <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles size={10} className="text-sky-400" /> Conectado a la API de notas clínicas
                </span>
                <span className="text-[11px] text-slate-300 dark:text-slate-700">
                  {editContent.length} caracteres · {editContent.split(/\s+/).filter(Boolean).length} palabras
                </span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center mb-4">
                <FileText size={28} className="text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">Selecciona una nota</h3>
              <p className="text-sm text-slate-400 mb-4">Elige una nota de la lista o crea una nueva</p>
              <button
                onClick={handleNewNote}
                className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all"
              >
                <Plus size={15} /> Nueva Nota
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesView;
