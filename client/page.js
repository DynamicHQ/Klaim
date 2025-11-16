'use client';

import { useEffect, useState } from 'react';

export default function Collection() {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const storedCollection = JSON.parse(localStorage.getItem('collection')) || [];
    setCollection(storedCollection);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Collection</h1>
      {collection.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collection.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (<p>Your collection is empty.</p>)}
    </div>
  );
}