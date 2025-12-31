import React, { useState, useEffect, useRef } from "react";
import type { ProductVariant } from "@/lib/shopify/types";
import { BiLoaderAlt } from "react-icons/bi";
import { addItemToCart } from "@/cartStore";

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
  const [embroideryText, setEmbroideryText] = useState("");
  const [embroideryColor, setEmbroideryColor] = useState("#000000");
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
      const attributes = embroideryText 
        ? [
            { key: "Embroidery Text", value: embroideryText },
            { key: "Embroidery Color", value: embroideryColor }
          ]
        : [];
      const result = await addItemToCart(selectedVariantId, attributes);
      setMessage(result);
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
            value={embroideryText}
            onChange={(e) => setEmbroideryText(e.target.value)}
            maxLength={12}
          />
          <p className="text-xs text-text-light mt-1">Max 12 characters</p>
        </div>

        {embroideryText && (
          <div className="mb-2">
            <label htmlFor="embroidery-color" className="block text-sm font-medium mb-2">Thread Color</label>
            <div className="flex items-center gap-3">
              <input
                id="embroidery-color"
                type="color"
                className="h-10 w-10 p-1 rounded cursor-pointer"
                value={embroideryColor}
                onChange={(e) => setEmbroideryColor(e.target.value)}
              />
              <span className="text-sm">{embroideryColor}</span>
            </div>
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
