import React, { useState, useEffect, useRef } from "react";
import type { ProductVariant } from "@/lib/shopify/types";
import { BiLoaderAlt } from "react-icons/bi";
import { addItemToCart } from "@/cartStore";
import { embroideryColor, embroideryText } from "@/personalizationStore";
import { useStore } from "@nanostores/react";

interface SubmitButtonProps {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  stylesClass: string;
  handle: string | null;
  pending: boolean;
  onClick: (e: React.FormEvent) => void;
}

function SubmitButton({
  availableForSale,
  selectedVariantId,
  stylesClass,
  handle,
  pending,
  onClick,
}: SubmitButtonProps) {
  const buttonClasses = stylesClass;
  const disabledClasses = "cursor-not-allowed flex";

  const DynamicTag = handle === null ? "button" : "a";

  if (!availableForSale) {
    return (
      <button
        disabled
        aria-disabled
        className={`${buttonClasses} ${disabledClasses}`}
      >
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <DynamicTag
        href={`/products/${handle}`}
        aria-label="Please select an option"
        aria-disabled
        className={`${buttonClasses} ${DynamicTag === "button" ? disabledClasses : ""}`}
      >
        Select Variant
      </DynamicTag>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label="Add to cart"
      aria-disabled={pending ? "true" : "false"}
      className={`${buttonClasses}`}
    >
      {pending ? (
        <BiLoaderAlt
          className={`animate-spin w-[70px] md:w-[85px]`}
          size={26}
        />
      ) : (
        "Add To Cart"
      )}
    </button>
  );
}

interface AddToCartProps {
  variants: ProductVariant[];
  availableForSale: boolean;
  stylesClass: string;
  handle: string | null;
  defaultVariantId: string | undefined;
}

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

  // Function to update selectedVariantId based on URL
  const updateSelectedVariantFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedOptions = Array.from(searchParams.entries());

    const variant = variants.find((variant) =>
      selectedOptions.every(([key, value]) =>
        variant.selectedOptions.some(
          (option) =>
            option.name.toLowerCase() === key && option.value === value,
        ),
      ),
    );

    setSelectedVariantId(variant?.id || defaultVariantId);
  };

  useEffect(() => {
    // Update selected variant on mount and whenever the variants change
    updateSelectedVariantFromUrl();

    // Set up popstate listener for browser navigation
    const handlePopState = () => {
      updateSelectedVariantFromUrl();
    };

    // Set up URL change detection
    const detectUrlChange = () => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl.current) {
        lastUrl.current = currentUrl;
        updateSelectedVariantFromUrl();
      }
    };

    // Set up observers
    window.addEventListener("popstate", handlePopState);

    // Check for URL changes every 100ms
    const urlCheckInterval = setInterval(detectUrlChange, 100);

    // Clean up
    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearInterval(urlCheckInterval);
    };
  }, [variants, defaultVariantId]);

  // Optional: Listen to pushState and replaceState
  useEffect(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      updateSelectedVariantFromUrl();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      updateSelectedVariantFromUrl();
    };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

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
        <h3 className="text-lg font-medium mb-4">Personalization (DEBUG ACTIVE)</h3>
        <div className="bg-red-100 p-2 mb-2 text-red-800">System Status: Active</div>
        
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
