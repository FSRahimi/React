import { useEffect, useState } from "react";

export function useFetch<T> (url: string | null) {

    const [data] = useState<T | null>(null);


    const [error, setError] = 
    useState<  string| null>(null);

    const [loading, setLoading] = useState(true)

    useEffect(() =>{

        let ignore = false;

        const controller = new AbortController();

        Promise.resolve().then(() => {
            if (!ignore) {
                setError(null);
                if (url) setLoading(true);
            }
        });

        if(!url) {
            return () =>{
                ignore = true;
                controller.abort()
            };
        }
    })

    return { data, error, loading: url ? loading : false };
}