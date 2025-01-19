import React, { createContext, useContext, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: string;
  date: string;
};

type ProductContextType = {
  history: Product[];
  addToHistory: (product: Product) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<Product[]>([]);

  const addToHistory = (product: Product) => {
    setHistory(prev => [product, ...prev]);
  };

  return (
    <ProductContext.Provider value={{ history, addToHistory }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}