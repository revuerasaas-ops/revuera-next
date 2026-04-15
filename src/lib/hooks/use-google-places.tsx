"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GOOGLE_PLACES_KEY } from "@/lib/constants";

type PlaceResult = {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
};

// Load Google Maps JS SDK once
let loadPromise: Promise<void> | null = null;
function loadGoogleMaps(): Promise<void> {
  if (loadPromise) return loadPromise;
  if (typeof window !== "undefined" && (window as any).google?.maps?.places) {
    return Promise.resolve();
  }
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_KEY}&v=beta&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return loadPromise;
}

export function useGooglePlaces() {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const tokenRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        setReady(true);
        const g = (window as any).google;
        if (g?.maps?.places?.AutocompleteSessionToken) {
          tokenRef.current = new g.maps.places.AutocompleteSessionToken();
        }
      })
      .catch(() => setReady(false));
  }, []);

  const search = useCallback(
    (query: string) => {
      if (!query || query.length < 3) { setResults([]); return; }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const g = (window as any).google;
          if (!g?.maps?.places?.AutocompleteSuggestion) {
            // Fallback: use Places Service text search
            const service = new g.maps.places.PlacesService(
              document.createElement("div")
            );
            service.textSearch(
              { query, type: "establishment" },
              (results: any[], status: string) => {
                if (status === "OK" && results) {
                  setResults(
                    results.slice(0, 5).map((r: any) => ({
                      place_id: r.place_id,
                      name: r.name,
                      formatted_address: r.formatted_address || "",
                      rating: r.rating,
                    }))
                  );
                } else {
                  setResults([]);
                }
                setLoading(false);
              }
            );
            return;
          }

          // Use new AutocompleteSuggestion API
          const result = await g.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            sessionToken: tokenRef.current,
            includedPrimaryTypes: ["establishment"],
          });

          const suggestions = result?.suggestions || [];
          const places: PlaceResult[] = [];

          for (const s of suggestions.slice(0, 5)) {
            const prediction = s.placePrediction;
            if (prediction) {
              places.push({
                place_id: prediction.placeId,
                name: prediction.mainText?.text || prediction.text?.text || "",
                formatted_address: prediction.secondaryText?.text || "",
              });
            }
          }

          setResults(places);
          // Reset token after selection
          tokenRef.current = new g.maps.places.AutocompleteSessionToken();
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 350);
    },
    [ready]
  );

  return { results, loading, search, ready };
}



export async function getPlaceDetails(placeId: string): Promise<{ rating: number; totalReviews: number; name: string } | null> {
  try {
    await loadGoogleMaps();
    const g = (window as any).google;
    if (!g?.maps?.places?.Place) return null;

    const place = new g.maps.places.Place({ id: placeId });
    await place.fetchFields({ fields: ["rating", "userRatingCount", "displayName"] });

    return {
      rating: place.rating || 0,
      totalReviews: place.userRatingCount || 0,
      name: place.displayName || "",
    };
  } catch {
    return null;
  }
}

export function getReviewLink(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}
