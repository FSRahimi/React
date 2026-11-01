import { useState } from "react";   

import type { Dispatch, SetStateAction } from "react";  



export function useLocalStorage<T> (
    key: string,
    initialValue: T
): [T, Dispatch<SetStateAction<T>>] {

    const [value, setValue ] = useState <T> (() =>{
try {
    const saved = localStorage.getItem(key);

    return saved !== null
    ? (JSON.parse(saved) as T)
    : initialValue; 

} catch {
     return initialValue;
}
    });

    const updateValue: Dispatch<SetStateAction<T>> = (
        nextValue
    ) => {
        setValue((previous) =>{
            const updated =
            typeof nextValue === "function" 
            ?( 
                nextValue as (previous: T ) => T
            )(previous)
            : nextValue;
            try {
                localStorage.setItem(
                    key,
                    JSON.stringify(updated)
                );
            } catch {
                // Keep the in-memory state when localStorage is unavailable.
            }
            return updated;
        })
    }
    return [value, updateValue];
}