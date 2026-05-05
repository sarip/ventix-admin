<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-12
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Libraries\Validate;
use App\Models\Event;
use App\Models\EventsAd;
use App\Models\EventsAgenda;
use App\Models\EventsGuest;
use App\Models\EventsOrganizer;
use App\Models\EventsSponsor;
use App\Models\EventTicket;
use App\Models\User;

class EventController extends ApiController
{

    /**
     * List Event Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/events List Event
     * @apiName List-Event
     * @apiGroup Event
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of Event
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
        $Model = new Event();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['is_external', 'external_url', 'events_organizer_id', 'user_id_pic', 'event_category', 'title', 'description', 'start_date', 'end_date', 'location_name', 'latitude', 'longitude', 'price_pool', 'registration_fee', 'thumbnail_url', 'events_status'],
        ];

        $current_user = $this->request->current_user;
        $where_eo['is_external'] = 'N';

        if (!empty($current_user['eo_id'])) {
            $where_eo['events_organizer_id'] = $current_user['eo_id'];
        }

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'events', $where_eo);
        array_walk($output['events'], function (&$item) {
            $User = new User();
            $EventOrganizer = new EventsOrganizer();
            $item->user = $User->find($item->user_id_pic);
            $item->event_organizer = $EventOrganizer->find($item->events_organizer_id);

            $EventsAgenda = new EventsAgenda();
            $item->events_agendas = $EventsAgenda->where('events_id', $item->id)->findAll();

            $EventsGuest = new EventsGuest();
            $item->events_guests = $EventsGuest->where('event_id', $item->id)->findAll();

            $EventTicket = new EventTicket();
            $item->events_tickets = $EventTicket->where('event_id', $item->id)->findAll();

            $EventSponsor = new EventsSponsor();
            $item->events_sponsors = $EventSponsor->where('events_id', $item->id)->findAll();
            // Map logo_url to full URL for frontend preview
            array_walk($item->events_sponsors, function (&$sponsor) {
                $sponsor->url = base_url('uploads/sponsor/' . $sponsor->logo_url);
            });

            $EventAd = new EventsAd();
            $item->events_ads = $EventAd->where('events_id', $item->id)->orderBy('sort_order', 'ASC')->findAll();
            // Map image_url to full URL for frontend preview
            array_walk($item->events_ads, function (&$ad) {
                $ad->preview_url = base_url('uploads/ads/' . $ad->image_url);
            });

        });

        // Return output
        return $this->successOutput($output);
    }

    public function external()
    {
        $Model = new Event();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['is_external', 'external_url', 'events_organizer_id', 'user_id_pic', 'event_category', 'title', 'description', 'start_date', 'end_date', 'location_name', 'latitude', 'longitude', 'price_pool', 'registration_fee', 'thumbnail_url', 'events_status'],
        ];

        $current_user = $this->request->current_user;
        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'events', ['is_external' => "Y"]);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create Event
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/event Create Event
     * @apiName Create-Event
     * @apiGroup Event
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} events_organizer_id events_organizer_id
     * @apiBody {String} user_id_pic user_id_pic
     * @apiBody {String} event_category event_category
     * @apiBody {String} title title
     * @apiBody {String} description description
     * @apiBody {String} start_date start_date
     * @apiBody {String} end_date end_date
     * @apiBody {String} location_name location_name
     * @apiBody {String} latitude latitude
     * @apiBody {String} longitude longitude
     * @apiBody {String} price_pool price_pool
     * @apiBody {String} registration_fee registration_fee
     * @apiBody {String} thumbnail_url thumbnail_url
     * @apiBody {String} events_status events_status

     *
     */
    public function create()
    {
        $Event = new Event();
        $data = [
            'event_category'  => $this->request->getPost('event_category'),
            'title'           => $this->request->getPost('title'),
            'start_date'      => $this->request->getPost('start_date'),
            'end_date'        => $this->request->getPost('end_date'),
            'location'        => $this->request->getPost('location'),
            'events_status'   => $this->request->getPost('events_status'),
            'is_external'     => "Y",
            'external_url'    => $this->request->getPost('external_url')
        ];

        // =========================
        // UPLOAD THUMBNAIL
        // =========================
        $file = $this->request->getFile('thumbnail_url');

        if ($file && $file->isValid() && !$file->hasMoved()) {

            $newName = $file->getRandomName();

            $file->move(FCPATH . 'uploads/event', $newName);

            $data['thumbnail_url'] =  $newName;
        }


        // =========================
        // VALIDATION
        // =========================
        $rules = [
            'event_category' => 'required',
            'title'          => 'required',
            'start_date'     => 'required',
            'end_date'       => 'required',
            'events_status'  => 'required',
        ];


        $validate = Validate::run($data, $rules);

        if ($validate !== true) {
            return $this->errorOutput($validate, 400);
        }

        // =========================
        // INSERT DB
        // =========================
        $id = $Event->insert($data);

        return $this->successOutput([
            'id' => $id
        ], 201);
    }


    public function saveAll()
    {
        $db = \Config\Database::connect();
        $db->transBegin();



        try {
            $eventModel = new Event();
            $agendaModel = new EventsAgenda();
            $ticketModel = new EventTicket();
            $sponsorModel = new EventsSponsor();
            $adModel = new EventsAd();


            // ======================
            // STEP 1: EVENT
            // ======================
            $id = $this->request->getPost('id');
            $event_data = [
                'events_organizer_id' => $this->request->getPost('events_organizer_id'),
                'user_id_pic' => $this->request->getPost('user_id_pic'),
                'event_category' => $this->request->getPost('event_category'),
                'title' => $this->request->getPost('title'),
                'description' => $this->request->getPost('description'),
                'start_date' => $this->request->getPost('start_date'),
                'end_date' => $this->request->getPost('end_date'),
                'location_name' => $this->request->getPost('location_name'),
                'latitude' => $this->request->getPost('latitude'),
                'longitude' => $this->request->getPost('longitude'),
                'price_pool' => $this->request->getPost('price_pool'),
                'registration_fee' => $this->request->getPost('registration_fee'),
                'events_status' => $this->request->getPost('events_status')
            ];

            $file = $this->request->getFile('thumbnail_url');
            if ($file && $file->isValid() && !$file->hasMoved()) {
                $thumbnail_url = $file->getRandomName();
                $file->move(FCPATH . 'uploads/event', $thumbnail_url);
                $event_data['thumbnail_url'] = $thumbnail_url;
            }


            if (!empty($id)) {
                $eventModel->update($id, $event_data);
                $eventId = $id;
            } else {
                $eventId = $eventModel->insert($event_data, true);
            }

            if (!$eventId) {
                throw new \Exception('Gagal menyimpan event');
            }

            // ======================
            // STEP 2: AGENDA
            // ======================
            $agendas = json_decode($this->request->getPost('agendas'), true) ?? [];
            if (!empty($agendas)) {
                foreach ($agendas as $agenda) {
                    if (!empty($agenda['_isDeleted'])) {
                        $agendaModel->delete($agenda['id']);
                    }
                    $agenda['events_id'] = $eventId;

                    $agenda_data = [
                        'events_id' => $eventId,
                        'start_time' => $agenda['start_time'],
                        'end_time' => $agenda['end_time'],
                        'activity_name' => $agenda['activity_name'],
                        'notes' => $agenda['notes'],
                    ];

                    if (!empty($agenda['_isNew'])) {
                        $agendaModel->insert($agenda_data);
                    } else {
                        $agendaModel->update($agenda['id'], $agenda_data);
                    }
                }
            }

            // ======================
            // STEP 3: TICKETS
            // ======================
            $tickets = json_decode($this->request->getPost('tickets'), true) ?? [];
            if (!empty($tickets)) {
                foreach ($tickets as $ticket) {
                    if (!empty($ticket['_isDeleted'])) {
                        $ticketModel->delete($ticket['id']);
                    }

                    $ticket['event_id'] = $eventId;
                    $ticket_data = [
                        'event_id' => $eventId,
                        'name' => $ticket['name'],
                        'description' => $ticket['description'],
                        'price' => $ticket['price'],
                        'is_taxable' => $ticket['is_taxable'],
                        'tax_id' => $ticket['tax_id'],
                        'final_price' => $ticket['final_price'],
                        'total_capacity' => $ticket['total_capacity'],
                        'remaining_capacity' => $ticket['remaining_capacity'],
                        'max_per_order' => $ticket['max_per_order'] ?? 5,
                        'sales_start_date' => $ticket['sales_start_date'],
                        'sales_end_date' => $ticket['sales_end_date'],
                        'is_active' => $ticket['is_active'] ?? 1,
                        'sort_order' => $ticket['sort_order'] ?? 0,
                    ];


                    if (!empty($ticket['_isNew'])) {
                        $ticketModel->insert($ticket_data);
                    } else {
                        $ticketModel->update($ticket['id'], $ticket_data);
                    }
                }
            }

            // ======================
            // STEP 4: SPONSORS
            // ======================
            $sponsors_info = json_decode($this->request->getPost('sponsors_info'), true) ?? [];
            $sponsor_files = $this->request->getFiles();

            if (!empty($sponsors_info)) {
                foreach ($sponsors_info as $index => $info) {
                    if (!empty($info['_isDeleted']) && !empty($info['id'])) {
                        $sponsorModel->delete($info['id']);
                        continue;
                    }

                    if (!empty($info['_isNew'])) {
                        // Check for corresponding file in sponsor_logos array
                        // Frontend sends as sponsor_logos[0], sponsor_logos[1]...
                        $file = null;
                        if (isset($sponsor_files['sponsor_logos'][$index])) {
                            $file = $sponsor_files['sponsor_logos'][$index];
                        }

                        if ($file && $file->isValid() && !$file->hasMoved()) {
                            $logo_url = $file->getRandomName();
                            $file->move(FCPATH . 'uploads/sponsor', $logo_url);

                            $sponsorModel->insert([
                                'events_id' => $eventId,
                                'logo_url' => $logo_url
                            ]);
                        }
                    }
                }
            }

            // ======================
            // STEP 5: AD IMAGES
            // ======================
            $ads_info = json_decode($this->request->getPost('ads_info'), true) ?? [];
            $all_files = $this->request->getFiles();

            if (!empty($ads_info)) {
                foreach ($ads_info as $index => $info) {
                    // Delete if marked
                    if (!empty($info['_isDeleted']) && !empty($info['id'])) {
                        $existing = $adModel->find($info['id']);
                        if ($existing && file_exists(FCPATH . 'uploads/ads/' . $existing->image_url)) {
                            @unlink(FCPATH . 'uploads/ads/' . $existing->image_url);
                        }
                        $adModel->delete($info['id']);
                        continue;
                    }

                    if (!empty($info['_isNew'])) {
                        $file = null;
                        if (isset($all_files['ad_images'][$index])) {
                            $file = $all_files['ad_images'][$index];
                        }

                        if ($file && $file->isValid() && !$file->hasMoved()) {
                            $image_url = $file->getRandomName();
                            $file->move(FCPATH . 'uploads/ads', $image_url);

                            $adModel->insert([
                                'events_id' => $eventId,
                                'image_url' => $image_url,
                                'sort_order' => $index,
                            ]);
                        }
                    }
                }
            }

            // ======================
            // COMMIT
            // ======================
            if ($db->transStatus() === false) {
                throw new \Exception('Transaction gagal');

            }

            $db->transCommit();

            return $this->successOutput([
                'status' => true,
                'id' => $eventId
            ]);

        } catch (\Throwable $e) {
            $db->transRollback();

            return $this->errorOutput(
                $e->getMessage(),
                400
            );
        }
    }



    /**
     * Update Event
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/event/:id Update Event
     * @apiName Update-Event
     * @apiGroup Event
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Event id
     * @apiBody {String} events_organizer_id events_organizer_id
     * @apiBody {String} user_id_pic user_id_pic
     * @apiBody {String} event_category event_category
     * @apiBody {String} title title
     * @apiBody {String} description description
     * @apiBody {String} start_date start_date
     * @apiBody {String} end_date end_date
     * @apiBody {String} location_name location_name
     * @apiBody {String} latitude latitude
     * @apiBody {String} longitude longitude
     * @apiBody {String} price_pool price_pool
     * @apiBody {String} registration_fee registration_fee
     * @apiBody {String} thumbnail_url thumbnail_url
     * @apiBody {String} events_status events_status

     *
     */
    public function update($id)
    {
        $Event = new Event();
        $data = [
            'event_category'  => $this->request->getPost('event_category'),
            'title'           => $this->request->getPost('title'),
            'start_date'      => $this->request->getPost('start_date'),
            'end_date'        => $this->request->getPost('end_date'),
            'location'        => $this->request->getPost('location'),
            'events_status'   => $this->request->getPost('events_status'),
            'is_external'     => "Y",
            'external_url'    => $this->request->getPost('external_url')
        ];

        // =========================
        // UPLOAD THUMBNAIL
        // =========================
        $file = $this->request->getFile('thumbnail_url');
        if ($file && $file->isValid() && !$file->hasMoved()) {

            $newName = $file->getRandomName();
            $file->move(FCPATH . 'uploads/event', $newName);

            $data['thumbnail_url'] = $newName;

            // hapus file lama (jika ada)
            if (!empty($old['thumbnail_url'])) {
                $oldPath = FCPATH . 'uploads/event/' . $old['thumbnail_url'];
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }
        }

        // =========================
        // VALIDATION
        // =========================
        $rules = [
            'event_category' => 'required',
            'title'          => 'required',
            'start_date'     => 'required',
            'end_date'       => 'required',
            'events_status'  => 'required',
        ];


        $validate = Validate::run($data, $rules);

        if ($validate !== true) {
            return $this->errorOutput($validate, 400);
        }

        // =========================
        // INSERT DB
        // =========================
        $Event->update($id, $data);
        $data = $Event->find($id);

        return $this->successOutput(['event' => $data]);
    }


    /**
     * Delete Event
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/event/:id Delete Event
     * @apiName Delete-Event
     * @apiGroup Event
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Event id
     */
    public function delete($id)
    {
        $Event = new Event();
        $Event->delete($id);

        return $this->successOutput([], 200);
    }
}
