<?php

namespace App\Controllers\Api;

use App\Models\CertificateTemplate;

class CertificateTemplateController extends ApiController
{
    /**
     * Helper to safely get input variable whether from JSON or Form Post
     */
    private function getInputValue(string $key, $default = null)
    {
        $postVal = $this->request->getPost($key);
        if ($postVal !== null && $postVal !== '') {
            return $postVal;
        }

        try {
            $jsonVal = $this->request->getJsonVar($key);
            if ($jsonVal !== null) {
                return $jsonVal;
            }
        } catch (\Throwable $th) {
            // Ignore JSON parsing exceptions when request is multipart/form-data
        }

        return $default;
    }

    /**
     * List Certificate Templates
     */
    public function index()
    {
        $model = new CertificateTemplate();
        $templates = $model->orderBy('id', 'DESC')->findAll();
        return $this->successOutput(['data' => $templates]);
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
        return $this->successOutput(['data' => $template]);
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

        $templateJson = $this->getInputValue('template_json');
        if (is_array($templateJson) || is_object($templateJson)) {
            $templateJson = json_encode($templateJson);
        }

        $data = [
            'name'             => $this->getInputValue('name'),
            'description'      => $this->getInputValue('description', ''),
            'background_image' => $bgPath ?? $this->getInputValue('background_image'),
            'width'            => $this->getInputValue('width', 3508),
            'height'           => $this->getInputValue('height', 2480),
            'orientation'      => $this->getInputValue('orientation', 'LANDSCAPE'),
            'template_json'    => $templateJson,
            'is_active'        => $this->getInputValue('is_active', 1),
        ];

        if (empty($data['name'])) {
            return $this->errorOutput('Template name is required', 400);
        }

        $id = $model->insert($data);

        // Only one template may be active at a time, otherwise `where('is_active', 1)->first()`
        // used during certificate generation picks an arbitrary (oldest) template instead of
        // the one the user intended.
        if (!empty($data['is_active'])) {
            $model->where('id !=', $id)->set('is_active', 0)->update();
        }

        $created = $model->find($id);
        return $this->successOutput(['data' => $created, 'message' => 'Template created successfully']);
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

        $templateJson = $this->getInputValue('template_json');
        if (is_array($templateJson) || is_object($templateJson)) {
            $templateJson = json_encode($templateJson);
        }
        if (empty($templateJson)) {
            $templateJson = $existing->template_json;
        }

        $data = [
            'name'             => $this->getInputValue('name', $existing->name),
            'description'      => $this->getInputValue('description', $existing->description),
            'background_image' => $bgPath,
            'width'            => $this->getInputValue('width', $existing->width),
            'height'           => $this->getInputValue('height', $existing->height),
            'orientation'      => $this->getInputValue('orientation', $existing->orientation),
            'template_json'    => $templateJson,
            'is_active'        => $this->getInputValue('is_active', $existing->is_active),
        ];

        $model->update($id, $data);

        // Only one template may be active at a time (see create() for why).
        if (!empty($data['is_active'])) {
            $model->where('id !=', $id)->set('is_active', 0)->update();
        }

        $updated = $model->find($id);
        return $this->successOutput(['data' => $updated, 'message' => 'Template updated successfully']);
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
        return $this->successOutput(['message' => 'Template deleted successfully']);
    }
}
