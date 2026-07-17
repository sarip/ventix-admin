<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-06
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
    public function index() {
        $Model = new FacilitiesOrganizer();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['owner_user_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'facilities_organizer', []);

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
     * @apiBody {String} owner_user_id owner_user_id
     * @apiBody {String} facility_name facility_name
     * @apiBody {String} company_name company_name
     * @apiBody {String} legal_doc_path legal_doc_path
     * @apiBody {String} verification_status verification_status
     * @apiBody {String} verified_at verified_at
     * @apiBody {String} verified_by verified_by
     * @apiBody {String} verification_note verification_note
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
    public function create() {
        $FacilitiesOrganizer = new FacilitiesOrganizer();
        $create_data = [
            'owner_user_id' => $this->request->getJsonVar('owner_user_id'),
            'facility_name' => $this->request->getJsonVar('facility_name'),
            'company_name' => $this->request->getJsonVar('company_name'),
            'legal_doc_path' => $this->request->getJsonVar('legal_doc_path'),
            'verification_status' => $this->request->getJsonVar('verification_status'),
            'verified_at' => $this->request->getJsonVar('verified_at'),
            'verified_by' => $this->request->getJsonVar('verified_by'),
            'verification_note' => $this->request->getJsonVar('verification_note'),
            'email' => $this->request->getJsonVar('email'),
            'phone' => $this->request->getJsonVar('phone'),
            'website' => $this->request->getJsonVar('website'),
            'address' => $this->request->getJsonVar('address'),
            'logo_path' => $this->request->getJsonVar('logo_path'),
            'tax_id' => $this->request->getJsonVar('tax_id'),
            'description' => $this->request->getJsonVar('description'),
            'facility_slug' => $this->request->getJsonVar('facility_slug')
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
     * @apiBody {String} owner_user_id owner_user_id
     * @apiBody {String} facility_name facility_name
     * @apiBody {String} company_name company_name
     * @apiBody {String} legal_doc_path legal_doc_path
     * @apiBody {String} verification_status verification_status
     * @apiBody {String} verified_at verified_at
     * @apiBody {String} verified_by verified_by
     * @apiBody {String} verification_note verification_note
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
    public function update($id) {
        $FacilitiesOrganizer = new FacilitiesOrganizer();
        $update_data = [
            'owner_user_id' => $this->request->getJsonVar('owner_user_id'),
            'facility_name' => $this->request->getJsonVar('facility_name'),
            'company_name' => $this->request->getJsonVar('company_name'),
            'legal_doc_path' => $this->request->getJsonVar('legal_doc_path'),
            'verification_status' => $this->request->getJsonVar('verification_status'),
            'verified_at' => $this->request->getJsonVar('verified_at'),
            'verified_by' => $this->request->getJsonVar('verified_by'),
            'verification_note' => $this->request->getJsonVar('verification_note'),
            'email' => $this->request->getJsonVar('email'),
            'phone' => $this->request->getJsonVar('phone'),
            'website' => $this->request->getJsonVar('website'),
            'address' => $this->request->getJsonVar('address'),
            'logo_path' => $this->request->getJsonVar('logo_path'),
            'tax_id' => $this->request->getJsonVar('tax_id'),
            'description' => $this->request->getJsonVar('description'),
            'facility_slug' => $this->request->getJsonVar('facility_slug')
        ];

        $FacilitiesOrganizer->update($id, $update_data);

        $data = $FacilitiesOrganizer->find($id);

        return $this->successOutput(['facilitiesorganizer' => $data]);
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
    public function delete($id) {
        $FacilitiesOrganizer = new FacilitiesOrganizer();
        $FacilitiesOrganizer->delete($id);

        return $this->successOutput([], 200);
    }

      /**
     * Verify EventsOrganizer
     * @param $id
     * @return mixed
     */
    public function verify($id)
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
            $user = $userModel->where('eo_id', $id)->first();
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
