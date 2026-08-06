import APIClient from "@/lib/ApiClient";

class CertificateModel {
    public async list(params?: Record<string, any>) {
        return await APIClient.get('certificates', params);
    }

    public async getParticipants(eventId: number) {
        return await APIClient.get(`certificates/event/${eventId}/participants`);
    }

    public async generate(eventId: number, userId: number, templateId?: number) {
        return await APIClient.post('certificates/generate', { event_id: eventId, user_id: userId, template_id: templateId });
    }

    public async generateBulk(eventId: number, templateId?: number) {
        return await APIClient.post('certificates/generate-bulk', { event_id: eventId, template_id: templateId });
    }

    public async send(id: number, channel: 'EMAIL' | 'WHATSAPP') {
        return await APIClient.post(`certificates/${id}/send`, { channel });
    }

    public async verify(number: string) {
        return await APIClient.get(`certificates/verify/${number}`);
    }
}

export default new CertificateModel();
