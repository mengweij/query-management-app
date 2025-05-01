
import { FormData } from "./form_data";

export interface Query {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    status: 'OPEN' | 'RESOLVED';
    formData: FormData;
    formDataId: string;
}

export interface CreateQueryDto {
    title: string;
    description?: string;
    formDataId: string;
}


