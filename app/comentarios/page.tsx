"use client";

import { useSearchParams } from 'next/navigation';
import CommentSectionV2 from '../../src/components/CommentSection';

export default function ComentariosPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {userId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800">¡Registro exitoso!</h2>
            <p className="text-green-600">Ahora puedes participar en la discusión</p>
          </div>
        )}
        
        <CommentSectionV2 questionId="q1" />
      </div>
    </div>
  );
}