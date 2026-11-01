import { useState, useEffect } from "react";

export function useDebounce<T>(
    value: T,
    delay: number = 500
): T {
    const [debounceValue, setDebounceValue] =
    useState<T>(value);
    useEffect(() =>{

        const timer = window.setTimeout(()=> {
            setDebounceValue(value);
        } , delay)
  
        return () =>{  
            window.clearTimeout(timer);
        };
    }, [value, delay]);
    return debounceValue
}