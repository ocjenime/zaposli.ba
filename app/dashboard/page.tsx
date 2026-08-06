'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { isFirmRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { Plus, MapPin, ClipboardList, Loader2, User, Pencil, Trash2, X, DollarSign, Calendar } from 'lucide-react';
import { categories as allCategories, cities as allCities, getCategory } from '@/lib/data';

const categories = allCategories.filter((c) => !c.noSeo);
const cities = allCities.map((c) => c.name).sort((a, b) => a.localeCompare(b, 'bs'));

interface Job {
  id: string;
  title: string;
  city: string;
  category_slug: string;
  description: string;
  address: string | null;
  status: 'open' | 'bidding' | 'in_progress' | 'completed' | 'cancelled';
  budget_mode: 'open' | 'fixed' | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  created_at: string;
  bids: { id: string }[];
}

interface EditForm {
  title: string;
  category: string;
  description: string;
  city: string;
  address: string;
  budgetMode: 'open' | 'fixed';
  budgetMin: string;
  budgetMax: string;
  deadline: string;
}

const statusLabels: Record<Job['status'], string> = {
  open: 'Otvoren',
  bidding: 'U ponudama',
  in_progress: 'U toku',
  completed: 'Završen',
  cancelled: 'Otkazan',
};

const statusColors: Record<Job['status'], string> = {
  open: 'bg-blue-50 text-blue-700',
  bidding: 'bg-orange-50 text-brand-orange',
  in_progress: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

const emptyEditForm: EditForm = {
  title: '',
  category: '',
  description: '',
  city: '',
  address: '',
  budgetMode: 'open',
  budgetMin: '',
  budgetMax: '',
  deadline: '',
};

export default function DashboardPage() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/prijava/');
    } else if (isFirmRole(role)) {
      router.push('/dashboard/firma/');
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    if (user && role === 'client') fetchJobs();
  }, [user, role]);

  async function fetchJobs() {
    if (!user) return;
    setLoadingJobs(true);
    setError('');
    const { data, error: err } = await supabase
      .from('jobs')
      .select('*, bids(id)')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });
    if (err) {
      setError('Došlo je do greške prilikom učitavanja poslova.');
      setLoadingJobs(false);
      return;
    }
    setJobs((data as Job[]) || []);
    setLoadingJobs(false);
  }

  function openEdit(job: Job) {
    const cat = getCategory(job.category_slug);
    setEditForm({
      title: job.title,
      category: cat?.name || '',
      description: job.description || '',
      city: job.city,
      address: job.address || '',
      budgetMode: job.budget_mode === 'fixed' ? 'fixed' : 'open',
      budgetMin: job.budget_min?.toString() || '',
      budgetMax: job.budget_max?.toString() || '',
      deadline: job.deadline ? job.deadline.slice(0, 10) : '',
    });
    setEditingJob(job);
    setEditError('');
  }

  function closeEdit() {
    setEditingJob(null);
    setEditForm(emptyEditForm);
    setEditError('');
  }

  function validateEditBudget(): boolean {
    if (editForm.budgetMode !== 'fixed') return true;
    const min = editForm.budgetMin ? parseFloat(editForm.budgetMin) : null;
    const max = editForm.budgetMax ? parseFloat(editForm.budgetMax) : null;
    if ((min !== null && Number.isNaN(min)) || (max !== null && Number.isNaN(max))) {
      setEditError('Unesite ispravne iznose budžeta.');
      return false;
    }
    if (min !== null && max !== null && min > max) {
      setEditError('Minimalni budžet ne može biti veći od maksimalnog.');
      return false;
    }
    if (min === null && max === null) {
      setEditError('Za fiksni budžet unesite barem jedan iznos.');
      return false;
    }
    return true;
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingJob || !user) return;
    setEditError('');

    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.city || !editForm.category) {
      setEditError('Popunite naziv, opis, grad i kategoriju.');
      return;
    }
    if (!validateEditBudget()) return;

    const cat = categories.find((c) => c.name === editForm.category);
    if (!cat) {
      setEditError('Odabrana kategorija nije važeća.');
      return;
    }

    setEditSaving(true);

    const budgetMin = editForm.budgetMode === 'fixed' && editForm.budgetMin ? parseFloat(editForm.budgetMin) : null;
    const budgetMax = editForm.budgetMode === 'fixed' && editForm.budgetMax ? parseFloat(editForm.budgetMax) : null;
    const deadline = editForm.deadline || null;

    const { error: err } = await supabase
      .from('jobs')
      .update({
        title: editForm.title.trim(),
        category_slug: cat.slug,
        description: editForm.description.trim(),
        city: editForm.city,
        address: editForm.address.trim() || null,
        budget_mode: editForm.budgetMode,
        budget_min: budgetMin,
        budget_max: budgetMax,
        deadline,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingJob.id);

    setEditSaving(false);
    if (err) {
      setEditError(err.message);
      return;
    }
    await fetchJobs();
    closeEdit();
  }

  function extractStoragePath(url: string, bucket: string): string | null {
    try {
      const u = new URL(url);
      const marker = `/public/${bucket}/`;
      const idx = u.pathname.indexOf(marker);
      if (idx === -1) return null;
      return u.pathname.slice(idx + marker.length);
    } catch {
      return null;
    }
  }

  async function confirmDelete(id: string) {
    if (!user) return;
    setDeleteLoading(true);
    setError('');

    // Remove associated storage images first
    const { data: images } = await supabase
      .from('job_images')
      .select('image_url')
      .eq('job_id', id);
    const paths = (images || [])
      .map((img) => extractStoragePath(img.image_url, 'job-images'))
      .filter((p): p is string => Boolean(p));
    if (paths.length > 0) {
      await supabase.storage.from('job-images').remove(paths);
    }

    const { error: err } = await supabase.from('jobs').delete().eq('id', id);
    setDeleteLoading(false);
    setDeleteId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await fetchJobs();
  }

  async function completeJob(id: string) {
    setActionId(id);
    const { error: err } = await supabase
      .from('jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    setActionId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await fetchJobs();
  }

  async function cancelJob(id: string) {
    setActionId(id);
    const { error: err } = await supabase
      .from('jobs')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id);
    setActionId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await fetchJobs();
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-cloud">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-steel">{loading ? 'Učitavanje...' : 'Preusmjeravanje...'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Header />
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Moji poslovi</h1>
              <p className="text-steel text-sm flex items-center gap-2">
                {user.email}
                <Link
                  href="/dashboard/profil/"
                  className="inline-flex items-center gap-1 text-brand-orange hover:text-brand-orange-dark font-medium text-xs"
                >
                  <User className="w-3.5 h-3.5" /> Uredi profil
                </Link>
              </p>
            </div>
            <Link href="/objavi-projekat/" className="btn-primary text-sm py-2.5 px-4 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Objavi novi posao
            </Link>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          {loadingJobs ? (
            <div className="flex items-center justify-center py-12 text-steel">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Učitavanje poslova...
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Nemate objavljenih poslova</h3>
              <p className="text-steel text-sm mb-4">Objavite prvi posao i primite ponude od provjerenih firmi.</p>
              <Link href="/objavi-projekat/" className="btn-primary text-sm py-2.5 px-4">Objavi posao</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-steel mt-1">
                        <MapPin className="w-4 h-4" /> {job.city}
                        <span className="w-1 h-1 bg-steel rounded-full" />
                        <span>{job.bids?.length || 0} ponuda</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[job.status]}`}>
                      {statusLabels[job.status]}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                    <Link href={`/dashboard/poslovi/?id=${job.id}`} className="btn-primary text-sm py-2 px-4 text-center w-full sm:w-auto">
                      Pogledaj ponude
                    </Link>
                    {job.status === 'in_progress' && (
                      <>
                        <Link
                          href={`/dashboard/razgovor/?job_id=${job.id}`}
                          className="btn-secondary text-sm py-2 px-4 inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                        >
                          Razgovor
                        </Link>
                        <button
                          onClick={() => completeJob(job.id)}
                          disabled={actionId === job.id}
                          className="btn-secondary text-sm py-2 px-4 disabled:opacity-50 w-full sm:w-auto"
                        >
                          {actionId === job.id ? 'Obrada...' : 'Označi završen'}
                        </button>
                      </>
                    )}
                    {job.status === 'completed' && (
                      <Link
                        href={`/dashboard/recenzija/?job_id=${job.id}`}
                        className="btn-secondary text-sm py-2 px-4 inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                      >
                        Ostavi recenziju
                      </Link>
                    )}
                    {(job.status === 'open' || job.status === 'bidding') && (
                      <>
                        <button
                          onClick={() => openEdit(job)}
                          className="btn-secondary text-sm py-2 px-4 inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Uredi
                        </button>
                        <button
                          onClick={() => cancelJob(job.id)}
                          disabled={actionId === job.id}
                          className="text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-100 transition-colors disabled:opacity-50 w-full sm:w-auto"
                        >
                          Otkaži
                        </button>
                        <button
                          onClick={() => setDeleteId(job.id)}
                          className="text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-100 transition-colors inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Izbriši
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Edit job modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Uredi posao</h2>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Zatvori">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {editError && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{editError}</p>}

            <form onSubmit={saveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naziv posla</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                  required
                >
                  <option value="">Odaberi kategoriju</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none resize-none"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grad</label>
                  <select
                    value={editForm.city}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                    required
                  >
                    <option value="">Odaberi grad</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresa (opcionalno)</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budžet</label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="budgetMode"
                      value="open"
                      checked={editForm.budgetMode === 'open'}
                      onChange={() => setEditForm((prev) => ({ ...prev, budgetMode: 'open', budgetMin: '', budgetMax: '' }))}
                      className="text-brand-orange focus:ring-brand-orange"
                    />
                    Majstori predlažu cijenu
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="budgetMode"
                      value="fixed"
                      checked={editForm.budgetMode === 'fixed'}
                      onChange={() => setEditForm((prev) => ({ ...prev, budgetMode: 'fixed' }))}
                      className="text-brand-orange focus:ring-brand-orange"
                    />
                    Fiksni raspon
                  </label>
                </div>
                {editForm.budgetMode === 'fixed' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Min. budžet (KM)"
                        value={editForm.budgetMin}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, budgetMin: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Max. budžet (KM)"
                        value={editForm.budgetMax}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, budgetMax: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rok (opcionalno)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, deadline: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={editSaving}
                  className="btn-primary text-sm py-2.5 px-6 inline-flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
                >
                  {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                  {editSaving ? 'Spremanje...' : 'Spremi izmjene'}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="btn-secondary text-sm py-2.5 px-6 w-full sm:w-auto"
                >
                  Odustani
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Izbriši posao?</h3>
                <p className="text-sm text-steel">
                  Ova radnja se ne može poništiti. Ako posao ima ponude, one će također biti uklonjene.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => confirmDelete(deleteId)}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 px-4 rounded-xl font-semibold transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleteLoading ? 'Brisanje...' : 'Da, izbriši'}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                className="btn-secondary text-sm py-2.5 px-4 w-full sm:w-auto"
              >
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
