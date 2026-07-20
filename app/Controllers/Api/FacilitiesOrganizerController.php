<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-18
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\FacilitiesOrganizer;

class FacilitiesOrganizerController extends ApiController
{

    /**
     * List FacilitiesOrganizer Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/facilities_organizer List FacilitiesOrganizer
     * @apiName List-FacilitiesOrganizer
     * @apiGroup FacilitiesOrganizer
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of FacilitiesOrganizer
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index()
    {
        $Model = new FacilitiesOrganizer();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['facility_name'],
        ];

        $current_user = $this->request->current_user ?? ['scope' => 'SUPERADMIN', 'id' => null];
        $where_facility = [];

        if($current_user['scope'] !== 'SUPERADMIN') {
            $where_facility['owner_user_id'] = $current_user['id'] ? $current_user['id'] : [-1];
        }

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'facilities_organizer', $where_facility);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create FacilitiesOrganizer
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/facilitiesorganizer Create FacilitiesOrganizer
     * @apiName Create-FacilitiesOrganizer
     * @apiGroup FacilitiesOrganizer
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} facility_name facility_name
     * @apiBody {String} company_name company_name
     * @apiBody {String} email email
     * @apiBody {String} phone phone
     * @apiBody {String} website website
     * @apiBody {String} address address
     * @apiBody {String} logo_path logo_path
     * @apiBody {String} tax_id tax_id
     * @apiBody {String} description description
     * @apiBody {String} facility_slug facility_slug

     *
     */
    public function create()
    {
        $FacilitiesOrganizer = new FacilitiesOrganizer();

        $logoName = null;
        $file = $this->request->getFile('logo_path');

        if ($file && $file->isValid() && !$file->hasMoved()) {
            $logoName = $file->getRandomName();
            $file->move(FCPATH . 'uploads/facilities_organizer', $logoName);
        }

        // Handle legal document upload
        $legalDocName = null;
        $legalFile = $this->request->getFile('legal_doc_path');
        if ($legalFile && $legalFile->isValid() && !$legalFile->hasMoved()) {
            $legalDocName = $legalFile->getRandomName();
            $legalFile->move(FCPATH . 'uploads/legality', $legalDocName);
        }

        $create_data = [
            'owner_user_id' => $this->request->current_user['id'] ?? null,
            'facility_name' => $this->request->getPost('facility_name'),
            'company_name' => $this->request->getPost('company_name'),
            'email' => $this->request->getPost('email'),
            'phone' => $this->request->getPost('phone'),
            'website' => $this->request->getPost('website'),
            'address' => $this->request->getPost('address'),
            'logo_path' => $logoName,
            'tax_id' => $this->request->getPost('tax_id'),
            'description' => $this->request->getPost('description'),
            'legal_doc_path' => $legalDocName,
            'facility_slug' => generate_slug($this->request->getPost('facility_name')),
        ];

        $id = $FacilitiesOrganizer->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }



    /**
     * Update FacilitiesOrganizer
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/facilitiesorganizer/:id Update FacilitiesOrganizer
     * @apiName Update-FacilitiesOrganizer
     * @apiGroup FacilitiesOrganizer
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id FacilitiesOrganizer id
     * @apiBody {String} facility_name facility_name
     * @apiBody {String} company_name company_name
     * @apiBody {String} email email
     * @apiBody {String} phone phone
     * @apiBody {String} website website
     * @apiBody {String} address address
     * @apiBody {String} logo_path logo_path
     * @apiBody {String} tax_id tax_id
     * @apiBody {String} description description
     * @apiBody {String} facility_slug facility_slug

     *
     */
    public function update(?int $id = null)
    {
        $FacilitiesOrganizer = new FacilitiesOrganizer();
        $existing = $FacilitiesOrganizer->find($id);

        if (!$existing) {
            return $this->failNotFound('Facilities Organizer not found');
        }

        $logoName = $existing->logo_path;
        $file = $this->request->getFile('logo_path');
        if ($file && $file->isValid() && !$file->hasMoved()) {

            // hapus logo lama
            if ($logoName && file_exists(FCPATH . 'uploads/facilities_organizer/' . $logoName)) {
                unlink(FCPATH . 'uploads/facilities_organizer/' . $logoName);
            }

            $logoName = $file->getRandomName();
            $file->move(FCPATH . 'uploads/facilities_organizer', $logoName);
        }

        // Handle legal document update
        $legalDocName = $existing->legal_doc_path;
        $legalFile = $this->request->getFile('legal_doc_path');
        if ($legalFile && $legalFile->isValid() && !$legalFile->hasMoved()) {
            // Delete old legal document
            if ($legalDocName && file_exists(FCPATH . 'uploads/legality/' . $legalDocName)) {
                unlink(FCPATH . 'uploads/legality/' . $legalDocName);
            }

            $legalDocName = $legalFile->getRandomName();
            $legalFile->move(FCPATH . 'uploads/legality', $legalDocName);
        }

        $update_data = [
            'facility_name' => $this->request->getPost('facility_name'),
            'company_name' => $this->request->getPost('company_name'),
            'email' => $this->request->getPost('email'),
            'phone' => $this->request->getPost('phone'),
            'website' => $this->request->getPost('website'),
            'address' => $this->request->getPost('address'),
            'logo_path' => $logoName,
            'tax_id' => $this->request->getPost('tax_id'),
            'description' => $this->request->getPost('description'),
            'legal_doc_path' => $legalDocName,
            'facility_slug' => generate_slug($this->request->getPost('facility_name')),
        ];

        $FacilitiesOrganizer->update($id, $update_data);

        return $this->successOutput([
            'facilitiesorganizer' => $FacilitiesOrganizer->find($id)
        ]);
    }



    /**
     * Delete FacilitiesOrganizer
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/facilitiesorganizer/:id Delete FacilitiesOrganizer
     * @apiName Delete-FacilitiesOrganizer
     * @apiGroup FacilitiesOrganizer
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id FacilitiesOrganizer id
     */
    public function delete(?int $id = null)
    {
        $FacilitiesOrganizer = new FacilitiesOrganizer();
        $data = $FacilitiesOrganizer->find($id);

        if (!$data) {
            return $this->errorOutput('Facilities Organizer not found');
        }

        if (!empty($data->logo_path)) {
            $filePath = FCPATH . 'uploads/facilities_organizer/' . $data->logo_path;
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        if (!empty($data->legal_doc_path)) {
            $legalFilePath = FCPATH . 'uploads/legality/' . $data->legal_doc_path;
            if (file_exists($legalFilePath)) {
                unlink($legalFilePath);
            }
        }

        $FacilitiesOrganizer->delete($id);

        return $this->successOutput([], 200);
    }

    /**
     * Verify FacilitiesOrganizer
     * @param $id
     * @return mixed
     */
    public function verify(?int $id = null)
    {
        $FacilitiesOrganizer = new FacilitiesOrganizer();
        $data = $FacilitiesOrganizer->find($id);

        if (!$data) {
            return $this->errorOutput('Facilities Organizer not found');
        }

        $json = $this->request->getJSON();
        $status = $json->status ?? null;
        $note = $json->note ?? null;

        if (!in_array($status, ['Approved', 'Rejected'])) {
            return $this->errorOutput('Invalid status');
        }

        $update_data = [
            'verification_status' => $status,
            'verification_note' => $note,
            'verified_at' => date('Y-m-d H:i:s'),
            'verified_by' => $this->request->id ?? null
        ];

        $FacilitiesOrganizer->update($id, $update_data);

        // If approved, we might want to activate the connected user account
        if ($status === 'Approved') {
            $userModel = new \App\Models\User();
            $user = $userModel->where('facility_id', $id)->first();
            if ($user && $user->status === 'Inactive') {
                $userModel->update($user->id, ['status' => 'Active']);
            }
        }

        return $this->successOutput([
            'message' => "Facilities Organizer {$status}",
            'facilitiesorganizer' => $FacilitiesOrganizer->find($id)
        ]);
    }

}
