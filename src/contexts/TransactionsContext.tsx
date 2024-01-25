import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

interface CreateTransactionInput {
    description: string;
    price: number;
    category: string;
    type: 'income' | 'outcome'
}

interface Transaction {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    price: number;
    category: string;
    createdAt: string;
}

interface TransactionContextType {
    transactions: Transaction[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransactions: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionProviderProps {
    children: ReactNode;
}



export const TransactionContext = createContext({} as TransactionContextType);

export function TransactionProvider({children} :TransactionProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([])

    const fetchTransactions = useCallback(async (query?: string) => {
        const reponse = await api.get('/transactions', {
         params: {
         //   _sort: 'createdAt',
         //   _order: 'desc',
            q: query,
         }   
        })
        
        setTransactions(reponse.data);
    }, [])

    const createTransactions = useCallback (async (data: CreateTransactionInput) => {
        const { description, price, category, type } = data;

        const response = await api.post('transactions', {
            description,
            price,
            category,
            type,
            createdAt: new Date(),
        })

        setTransactions(state => [response.data , ...state]);
    }, [])

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions])

    return (
        <TransactionContext.Provider value={{transactions, fetchTransactions, createTransactions}}>
            {children}
        </TransactionContext.Provider>
    );
}