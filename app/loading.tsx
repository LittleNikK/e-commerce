import React from 'react';

export default function Loading() {
  return (
    <div className="bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#3D4A3C] border-t-transparent rounded-full animate-spin mx-auto" />
        <span className="font-serif-editorial text-sm tracking-widest uppercase text-[#5C564E] block">
          Loading Second Story Archive...
        </span>
      </div>
    </div>
  );
}
