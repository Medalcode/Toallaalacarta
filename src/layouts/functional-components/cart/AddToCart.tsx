import { embroideryColor, embroideryText } from "@/personalizationStore";
import { useStore } from "@nanostores/react";
import React, { useState, useEffect, useRef } from "react";

// ... (inside AddToCart component)

export function AddToCart({
  variants,
  availableForSale,
  stylesClass,
  handle,
  defaultVariantId,
}: AddToCartProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(defaultVariantId);
  
  // Use global store for personalization
  const $embroideryText = useStore(embroideryText);
  const $embroideryColor = useStore(embroideryColor);
  
  const lastUrl = useRef(window.location.href);

  // ... (keep existing updateSelectedVariantFromUrl and effects)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) return;

    setPending(true);
    try {
      const attributes = $embroideryText 
        ? [
            { key: "Embroidery Text", value: $embroideryText },
            { key: "Embroidery Color", value: $embroideryColor }
          ]
        : [];
      const result = await addItemToCart(selectedVariantId, attributes);
      setMessage(result);
      
      // Reset personalization after adding to cart
      embroideryText.set("");
      embroideryColor.set("#000000");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6 p-4 bg-light/50 dark:bg-darkmode-light/50 rounded-lg border border-border">
        <h3 className="text-lg font-medium mb-4">Personalization</h3>
        
        <div className="mb-4">
          <label htmlFor="embroidery-text" className="block text-sm font-medium mb-2">Border Text (Optional)</label>
          <input
            id="embroidery-text"
            type="text"
            className="w-full px-4 py-2 rounded-md border border-border bg-white dark:bg-darkmode-body focus:ring-primary focus:border-primary"
            placeholder="Name or Initials"
            value={$embroideryText}
            onChange={(e) => embroideryText.set(e.target.value)}
            maxLength={12}
          />
          <p className="text-xs text-text-light mt-1">Max 12 characters</p>
        </div>

        {$embroideryText && (
          <div className="mb-2">
            <label className="block text-sm font-medium mb-3">Thread Color</label>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Gold', hex: '#D4AF37' },
                { name: 'Silver', hex: '#C0C0C0' },
                { name: 'Navy', hex: '#000080' },
                { name: 'Black', hex: '#000000' },
                { name: 'White', hex: '#FFFFFF', border: true },
                { name: 'Red', hex: '#C41E3A' },
                { name: 'Green', hex: '#50C878' }
              ].map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 dark:ring-offset-darkmode-body ${
                    $embroideryColor === color.name 
                      ? "ring-primary scale-110" 
                      : "ring-transparent hover:ring-border"
                  } ${color.border ? "border border-border" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => embroideryColor.set(color.name)}
                  title={color.name}
                  aria-label={`Select ${color.name} thread`}
                />
              ))}
            </div>
            <p className="text-sm mt-2 text-text-light">Selected: <span className="font-medium text-text-dark dark:text-darkmode-text-dark">{$embroideryColor}</span></p>
          </div>
        )}
      </div>

      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        stylesClass={stylesClass}
        handle={handle}
        pending={pending}
        onClick={handleSubmit}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
