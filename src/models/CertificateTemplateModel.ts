import APIClient from "@/lib/ApiClient";

export interface CertificateTemplate {
    id?: number;
    name: string;
    description?: string;
    background_image?: string;
    width?: number;
    height?: number;
    orientation?: 'LANDSCAPE' | 'PORTRAIT';
    template_json?: any;
    is_active?: number;
}

class CertificateTemplateModel {
    public async list() {
        return await APIClient.get('certificate-templates');
    }

    public async show(id: number) {
        return await APIClient.get(`certificate-templates/${id}`);
    }

    public async create(data: FormData | CertificateTemplate) {
        return await APIClient.post('certificate-templates', data);
    }

    public async update(id: number, data: FormData | CertificateTemplate) {
        return await APIClient.post(`certificate-templates/${id}`, data);
    }

    public async delete(id: number) {
        return await APIClient.delete(`certificate-templates/${id}`);
    }
}

export default new CertificateTemplateModel();
