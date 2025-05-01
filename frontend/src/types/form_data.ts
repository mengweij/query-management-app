import { Query } from "./query";

export interface FormData {
    id: string;
    question: string;
    answer: string;
    query?: Query;
}

export interface CreateFormDataDto {
    question: string;
    answer: string;
}