import APIClient from "@/lib/ApiClient";

class CertificateModel {
    public async list(params?: Record<string, any>) {
        return await APIClient.get('certificates', params);
    }

    public async getParticipants(eventId: number) {
        return await APIClient.get(`certificates/event/${eventId}/participants`);
    }

    public async generate(eventId: number, userId: number, templateId?: number, forceRegenerate?: boolean) {
        return await APIClient.post('certificates/generate', { event_id: eventId, user_id: userId, template_id: templateId, force_regenerate: forceRegenerate });
    }

    public async generateBulk(eventId: number, templateId?: number, forceRegenerate?: boolean) {
        return await APIClient.post('certificates/generate-bulk', { event_id: eventId, template_id: templateId, force_regenerate: forceRegenerate });
    }

    public async send(id: number, channel: 'EMAIL' | 'WHATSAPP') {
        return await APIClient.post(`certificates/${id}/send`, { channel });
    }

    public async sendBulk(certificateIds: number[], channel: 'EMAIL' | 'WHATSAPP') {
        return await APIClient.post('certificates/send-bulk', { certificate_ids: certificateIds, channel });
    }

    public async verify(number: string) {
        return await APIClient.get(`certificates/verify/${number}`);
    }
}

export default new CertificateModel();
