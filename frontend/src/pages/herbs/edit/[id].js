import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import HerbForm from '../../../components/HerbForm';
import { fetchHerbById, updateHerb } from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function EditHerbPage() {
  const router = useRouter();
  const { id } = router.query;
  const [herb, setHerb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) loadHerb();
  }, [id]);

  const loadHerb = async () => {
    setLoading(true);
    try {
      const data = await fetchHerbById(id);
      setHerb(data);
    } catch (err) {
      setError('Failed to load herb data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await updateHerb(id, formData);
      router.push(`/herbs/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update herb');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;

  return (
    <>
      <Head><title>Edit {herb?.name} - Herb Encyclopedia</title></Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800 mb-6">Edit Herb</h1>
        {error && <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>}
        {herb && <HerbForm initialData={herb} onSubmit={handleSubmit} submitting={submitting} onCancel={() => router.back()} />}
      </div>
    </>
  );
}