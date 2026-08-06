<?php

namespace App\Controllers\Api;

use App\Models\CertificateTemplate;

class CertificateTemplateController extends ApiController
{
    /**
     * List Certificate Templates
     */
    public function index()
    {
        $model = new CertificateTemplate();
        $templates = $model->orderBy('id', 'DESC')->findAll();
        return $this->successOutput($templates);
    }

    /**
     * Detail Template
     */
    public function show($id)
    {
        $model = new CertificateTemplate();
        $template = $model->find($id);
        if (!$template) {
            return $this->errorOutput('Template not found', 404);
        }
        return $this->successOutput($template);
    }

    /**
     * Create Template
     */
    public function create()
    {
        $model = new CertificateTemplate();

        $bgImage = $this->request->getFile('background_image');
        $bgPath = null;
        if ($bgImage && $bgImage->isValid() && !$bgImage->hasMoved()) {
            $uploadDir = FCPATH . 'uploads/certificate_templates';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $newName = $bgImage->getRandomName();
            $bgImage->move($uploadDir, $newName);
            $bgPath = 'uploads/certificate_templates/' . $newName;
        }

        $data = [
            'name'             => $this->request->getPost('name') ?? $this->request->getJsonVar('name'),
            'description'      => $this->request->getPost('description') ?? $this->request->getJsonVar('description'),
            'background_image' => $bgPath ?? $this->request->getPost('background_image') ?? $this->request->getJsonVar('background_image'),
            'width'            => $this->request->getPost('width') ?? $this->request->getJsonVar('width') ?? 3508,
            'height'           => $this->request->getPost('height') ?? $this->request->getJsonVar('height') ?? 2480,
            'orientation'      => $this->request->getPost('orientation') ?? $this->request->getJsonVar('orientation') ?? 'LANDSCAPE',
            'template_json'    => is_array($this->request->getJsonVar('template_json')) ? json_encode($this->request->getJsonVar('template_json')) : ($this->request->getPost('template_json') ?? $this->request->getJsonVar('template_json')),
            'is_active'        => $this->request->getPost('is_active') ?? $this->request->getJsonVar('is_active') ?? 1,
        ];

        if (empty($data['name'])) {
            return $this->errorOutput('Template name is required', 400);
        }

        $id = $model->insert($data);
        return $this->successOutput($model->find($id), 'Template created successfully');
    }

    /**
     * Update Template
     */
    public function update($id)
    {
        $model = new CertificateTemplate();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->errorOutput('Template not found', 404);
        }

        $bgImage = $this->request->getFile('background_image');
        $bgPath = $existing->background_image;
        if ($bgImage && $bgImage->isValid() && !$bgImage->hasMoved()) {
            $uploadDir = FCPATH . 'uploads/certificate_templates';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $newName = $bgImage->getRandomName();
            $bgImage->move($uploadDir, $newName);
            $bgPath = 'uploads/certificate_templates/' . $newName;
        }

        $jsonInput = $this->request->getJsonVar('template_json');
        $templateJson = is_array($jsonInput) || is_object($jsonInput) ? json_encode($jsonInput) : ($this->request->getPost('template_json') ?? $jsonInput ?? $existing->template_json);

        $data = [
            'name'             => $this->request->getPost('name') ?? $this->request->getJsonVar('name') ?? $existing->name,
            'description'      => $this->request->getPost('description') ?? $this->request->getJsonVar('description') ?? $existing->description,
            'background_image' => $bgPath,
            'width'            => $this->request->getPost('width') ?? $this->request->getJsonVar('width') ?? $existing->width,
            'height'           => $this->request->getPost('height') ?? $this->request->getJsonVar('height') ?? $existing->height,
            'orientation'      => $this->request->getPost('orientation') ?? $this->request->getJsonVar('orientation') ?? $existing->orientation,
            'template_json'    => $templateJson,
            'is_active'        => $this->request->getPost('is_active') ?? $this->request->getJsonVar('is_active') ?? $existing->is_active,
        ];

        $model->update($id, $data);
        return $this->successOutput($model->find($id), 'Template updated successfully');
    }

    /**
     * Delete Template
     */
    public function delete($id)
    {
        $model = new CertificateTemplate();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->errorOutput('Template not found', 404);
        }
        $model->delete($id);
        return $this->successOutput(null, 'Template deleted successfully');
    }
}
