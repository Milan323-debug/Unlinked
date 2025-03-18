import { useQuery } from '@tanstack/react-query';
import { fetchAuthUser } from '../lib/queries';

export const useAuth = () => {
    return useQuery({
        queryKey: ['authUser'],
        queryFn: fetchAuthUser,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}; 