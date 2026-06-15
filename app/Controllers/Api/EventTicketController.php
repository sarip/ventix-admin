<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Event;
use App\Models\EventTicket;
use App\Models\EventsSponsor;
use App\Models\MasterTaxe;
use App\Models\User;

class EventTicketController extends ApiController
{

    /**
     * List EventTicket Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/event_ticket List EventTicket
     * @apiName List-EventTicket
     * @apiGroup EventTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of EventTicket
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
        $Model = new EventTicket();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name', 'description', 'price', 'total_capacity', 'remaining_capacity', 'max_per_order', 'sales_start_date', 'sales_end_date', 'is_active', 'sort_order'],
        ];

        $current_user = $this->request->current_user;
        $where_eo = [];


        $Model->join('events e', 'e.id = event_ticket.event_id');
        $Model->select('event_ticket.*, e.events_organizer_id');
        $db = \Config\Database::connect();

        $event = $db->table('events')
            ->select('id');

            if($current_user['scope'] !== 'SUPERADMIN') {
                $event->where('events_organizer_id', $current_user['eo_id']);
            }
        $eventIds = $event->get()->getResultArray();

        $where_eo['group_or'] = [
            'event_ticket.event_id' =>  $eventIds ? array_column($eventIds, 'id') : [-1]
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'event_ticket', $where_eo);
        array_walk($output['event_ticket'], function (&$item) {
            $Event = new Event();
            $item->event = $Event->find($item->event_id);


            $MasterTaxe = new MasterTaxe();
            $item->tax = $item->is_taxable === "Y" ? $MasterTaxe->find($item->tax_id) : [];

            // Add sponsors to ticket event
            $EventSponsor = new EventsSponsor();
            $item->events_sponsors = $EventSponsor->where('events_id', $item->event_id)->findAll();
            array_walk($item->events_sponsors, function (&$sponsor) {
                $sponsor->url = base_url('uploads/sponsor/' . $sponsor->logo_url);
            });
        });

        // Return output
        return $this->successOutput($output);
    }


    public function find()
    {
        $Model = new EventTicket();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name', 'description', 'price', 'total_capacity', 'remaining_capacity', 'max_per_order', 'sales_start_date', 'sales_end_date', 'is_active', 'sort_order'],
        ];

        $current_user = $this->request->current_user;
        $where_eo = [];

//        $Model->join('events e', 'e.id = event_ticket.event_id');
//        $Model->select('event_ticket.*, e.events_organizer_id');
//        if (!empty($current_user['eo_id'])) {
//            $db = \Config\Database::connect();
//
//            $eventIds = $db->table('events')
//                ->select('id')
//                ->where('events_organizer_id', $current_user['eo_id'])
//                ->get()
//                ->getResultArray();
//
//            $where_eo['group_or'] = [
//                'event_ticket.event_id' =>  array_column($eventIds, 'id')
//            ];
//
//        }

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'event_ticket');
        array_walk($output['event_ticket'], function (&$item) {
            $Event = new Event();
            $item->event = $Event->find($item->event_id);


            $MasterTaxe = new MasterTaxe();
            $item->tax = $item->is_taxable === "Y" ? $MasterTaxe->find($item->tax_id) : [];

            // Add sponsors to ticket event
            $EventSponsor = new EventsSponsor();
            $item->events_sponsors = $EventSponsor->where('events_id', $item->event_id)->findAll();
            array_walk($item->events_sponsors, function (&$sponsor) {
                $sponsor->url = base_url('uploads/sponsor/' . $sponsor->logo_url);
            });
        });

        // Return output
        return $this->successOutput($output);
    }




    /**
     * Create EventTicket
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/eventticket Create EventTicket
     * @apiName Create-EventTicket
     * @apiGroup EventTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} event_id event_id
     * @apiBody {String} name name
     * @apiBody {String} description description
     * @apiBody {String} price price
     * @apiBody {String} total_capacity total_capacity
     * @apiBody {String} remaining_capacity remaining_capacity
     * @apiBody {String} max_per_order max_per_order
     * @apiBody {String} sales_start_date sales_start_date
     * @apiBody {String} sales_end_date sales_end_date
     * @apiBody {String} is_active is_active
     * @apiBody {String} sort_order sort_order

     *
     */
    public function create()
    {
        $EventTicket = new EventTicket();
        $db = \Config\Database::connect();
        $db->transBegin();

        try {
            $create_data = [
                'event_id' => $this->request->getPost('event_id'),
                'name' => $this->request->getPost('name'),
                'description' => $this->request->getPost('description'),
                'price' => $this->request->getPost('price'),
                'total_capacity' => $this->request->getPost('total_capacity'),
                'remaining_capacity' => $this->request->getPost('remaining_capacity'),
                'max_per_order' => $this->request->getPost('max_per_order'),
                'sales_start_date' => $this->request->getPost('sales_start_date'),
                'sales_end_date' => $this->request->getPost('sales_end_date'),
                'is_active' => $this->request->getPost('is_active'),
                'sort_order' => $this->request->getPost('sort_order')
            ];

            $id = $EventTicket->insert($create_data, true);

            if (!$id) {
                throw new \Exception('Failed to create ticket');
            }

            // Handle Sponsors
            $this->handleSponsors($id);

            $db->transCommit();
            return $this->successOutput(['id' => $id], 201);
        } catch (\Exception $e) {
            $db->transRollback();
            return $this->errorOutput($e->getMessage(), 400);
        }
    }


    /**
     * Update EventTicket
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/eventticket/:id Update EventTicket
     * @apiName Update-EventTicket
     * @apiGroup EventTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id EventTicket id
     * @apiBody {String} event_id event_id
     * @apiBody {String} name name
     * @apiBody {String} description description
     * @apiBody {String} price price
     * @apiBody {String} total_capacity total_capacity
     * @apiBody {String} remaining_capacity remaining_capacity
     * @apiBody {String} max_per_order max_per_order
     * @apiBody {String} sales_start_date sales_start_date
     * @apiBody {String} sales_end_date sales_end_date
     * @apiBody {String} is_active is_active
     * @apiBody {String} sort_order sort_order

     *
     */
    public function update($id)
    {
        $EventTicket = new EventTicket();
        $db = \Config\Database::connect();
        $db->transBegin();

        try {
            $update_data = [
                'event_id' => $this->request->getPost('event_id'),
                'name' => $this->request->getPost('name'),
                'description' => $this->request->getPost('description'),
                'price' => $this->request->getPost('price'),
                'total_capacity' => $this->request->getPost('total_capacity'),
                'remaining_capacity' => $this->request->getPost('remaining_capacity'),
                'max_per_order' => $this->request->getPost('max_per_order'),
                'sales_start_date' => $this->request->getPost('sales_start_date'),
                'sales_end_date' => $this->request->getPost('sales_end_date'),
                'is_active' => $this->request->getPost('is_active'),
                'sort_order' => $this->request->getPost('sort_order')
            ];

            $EventTicket->update($id, $update_data);

            // Handle Sponsors
            $this->handleSponsors($id, true);

            $db->transCommit();
            $data = $EventTicket->find($id);
            return $this->successOutput(['eventticket' => $data]);
        } catch (\Exception $e) {
            $db->transRollback();
            return $this->errorOutput($e->getMessage(), 400);
        }
    }

    private function handleSponsors($ticketId, $isUpdate = false)
    {
        $EventTicket = new EventTicket();
        $ticket = $EventTicket->find($ticketId);
        $eventId = $ticket->event_id;

        $sponsorModel = new EventsSponsor();
        $sponsors_info = json_decode($this->request->getPost('sponsors_info'), true) ?? [];
        $sponsor_files = $this->request->getFiles();

        if (!empty($sponsors_info)) {
            foreach ($sponsors_info as $index => $info) {
                if (!empty($info['_isDeleted']) && !empty($info['id'])) {
                    $sponsorModel->delete($info['id']);
                    continue;
                }

                if (!empty($info['_isNew'])) {
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
    }


    /**
     * Delete EventTicket
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/eventticket/:id Delete EventTicket
     * @apiName Delete-EventTicket
     * @apiGroup EventTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id EventTicket id
     */
    public function delete($id)
    {
        $EventTicket = new EventTicket();
        $EventTicket->delete($id);

        return $this->successOutput([], 200);
    }
}
