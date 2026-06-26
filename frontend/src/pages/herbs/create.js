import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import HerbForm from '../../components/HerbForm';
import { createHerb } from '../../lib/api';

export default function CreateHerbPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (herbData, images) => {
    setSubmitting(true);
    setError(null);

    try {
      // Create herb first
      const herb = await createHerb(herbData);
      
      // Upload images if any
      if (images && images.length > 0) {
        // Images will be uploaded in the form component
      }

      router.push(`/herbs/${herb.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create herb');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add New Herb - Herb Encyclopedia</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800 mb-6">Add New Herb</h1>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <HerbForm 
          onSubmit={handleSubmit}
          submitting={submitting}
          onCancel={() => router.back()}
        />
      </div>
    </>
  );
}