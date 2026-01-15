<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-12
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\EventsOrganizer;

class EventsOrganizerController extends ApiController
{

    /**
     * List EventsOrganizer Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/events_organizer List EventsOrganizer
     * @apiName List-EventsOrganizer
     * @apiGroup EventsOrganizer
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of EventsOrganizer
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new EventsOrganizer();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['eo_name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'events_organizer', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create EventsOrganizer
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/eventsorganizer Create EventsOrganizer
     * @apiName Create-EventsOrganizer
     * @apiGroup EventsOrganizer
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} eo_name eo_name
     * @apiBody {String} company_name company_name
     * @apiBody {String} email email
     * @apiBody {String} phone phone
     * @apiBody {String} website website
     * @apiBody {String} address address
     * @apiBody {String} logo_path logo_path
     * @apiBody {String} tax_id tax_id
     * @apiBody {String} description description
     * @apiBody {String} eo_slug eo_slug

     *
     */
    public function create()
    {
        $EventsOrganizer = new EventsOrganizer();

        $logoName = null;
        $file = $this->request->getFile('logo_path');

        if ($file && $file->isValid() && !$file->hasMoved()) {
            $logoName = $file->getRandomName();
            $file->move(FCPATH . 'uploads/event_organizer', $logoName);
        }

        $create_data = [
            'eo_name'       => $this->request->getPost('eo_name'),
            'company_name' => $this->request->getPost('company_name'),
            'email'        => $this->request->getPost('email'),
            'phone'        => $this->request->getPost('phone'),
            'website'      => $this->request->getPost('website'),
            'address'      => $this->request->getPost('address'),
            'logo_path'    => $logoName,
            'tax_id'       => $this->request->getPost('tax_id'),
            'description'  => $this->request->getPost('description'),
            'eo_slug'      => generate_slug($this->request->getPost('eo_name')),
        ];

        $id = $EventsOrganizer->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }



    /**
     * Update EventsOrganizer
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/eventsorganizer/:id Update EventsOrganizer
     * @apiName Update-EventsOrganizer
     * @apiGroup EventsOrganizer
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id EventsOrganizer id
     * @apiBody {String} eo_name eo_name
     * @apiBody {String} company_name company_name
     * @apiBody {String} email email
     * @apiBody {String} phone phone
     * @apiBody {String} website website
     * @apiBody {String} address address
     * @apiBody {String} logo_path logo_path
     * @apiBody {String} tax_id tax_id
     * @apiBody {String} description description
     * @apiBody {String} eo_slug eo_slug

     *
     */
    public function update($id)
    {
        $EventsOrganizer = new EventsOrganizer();
        $existing = $EventsOrganizer->find($id);

        if (!$existing) {
            return $this->failNotFound('Events Organizer not found');
        }

        $logoName = $existing->logo_path;

        $file = $this->request->getFile('logo_path');
        if ($file && $file->isValid() && !$file->hasMoved()) {

            // hapus logo lama
            if ($logoName && file_exists(FCPATH . 'uploads/event_organizer/' . $logoName)) {
                unlink(FCPATH . 'uploads/event_organizer/' . $logoName);
            }

            $logoName = $file->getRandomName();
            $file->move(FCPATH . 'uploads/event_organizer', $logoName);
        }

        $update_data = [
            'eo_name'       => $this->request->getPost('eo_name'),
            'company_name' => $this->request->getPost('company_name'),
            'email'        => $this->request->getPost('email'),
            'phone'        => $this->request->getPost('phone'),
            'website'      => $this->request->getPost('website'),
            'address'      => $this->request->getPost('address'),
            'logo_path'    => $logoName,
            'tax_id'       => $this->request->getPost('tax_id'),
            'description'  => $this->request->getPost('description'),
            'eo_slug'      => generate_slug($this->request->getPost('eo_name')),
        ];

        $EventsOrganizer->update($id, $update_data);

        return $this->successOutput([
            'eventsorganizer' => $EventsOrganizer->find($id)
        ]);
    }



    /**
     * Delete EventsOrganizer
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/eventsorganizer/:id Delete EventsOrganizer
     * @apiName Delete-EventsOrganizer
     * @apiGroup EventsOrganizer
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id EventsOrganizer id
     */
    public function delete($id)
    {
        $EventsOrganizer = new EventsOrganizer();
        $data = $EventsOrganizer->find($id);

        if (!$data) {
            return $this->errorOutput('Events Organizer not found');
        }

        if (!empty($data->logo_path)) {
            $filePath = FCPATH . 'uploads/event_organizer/' . $data->logo_path;
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $EventsOrganizer->delete($id);

        return $this->successOutput([], 200);
    }

}
