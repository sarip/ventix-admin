<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Event;
use App\Models\EventsAgenda;

class EventsAgendaController extends ApiController
{

    /**
     * List EventsAgenda Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/events_agendas List EventsAgenda
     * @apiName List-EventsAgenda
     * @apiGroup EventsAgenda
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of EventsAgenda
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new EventsAgenda();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['events_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'events_agendas', []);
        array_walk($output['events_agendas'], function(&$item) {
            $Event = new Event();
            $item->event = $Event->find($item->events_id);
        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create EventsAgenda
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/eventsagenda Create EventsAgenda
     * @apiName Create-EventsAgenda
     * @apiGroup EventsAgenda
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} events_id events_id
     * @apiBody {String} start_time start_time
     * @apiBody {String} end_time end_time
     * @apiBody {String} activity_name activity_name
     * @apiBody {String} notes notes

     *
     */
    public function create() {
        $EventsAgenda = new EventsAgenda();
        $create_data = [
            'events_id' => $this->request->getJsonVar('events_id'),
            'start_time' => $this->request->getJsonVar('start_time'),
            'end_time' => $this->request->getJsonVar('end_time'),
            'activity_name' => $this->request->getJsonVar('activity_name'),
            'notes' => $this->request->getJsonVar('notes')
        ];

        $id = $EventsAgenda->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update EventsAgenda
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/eventsagenda/:id Update EventsAgenda
     * @apiName Update-EventsAgenda
     * @apiGroup EventsAgenda
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id EventsAgenda id
     * @apiBody {String} events_id events_id
     * @apiBody {String} start_time start_time
     * @apiBody {String} end_time end_time
     * @apiBody {String} activity_name activity_name
     * @apiBody {String} notes notes

     *
     */
    public function update($id) {
        $EventsAgenda = new EventsAgenda();
        $update_data = [
            'events_id' => $this->request->getJsonVar('events_id'),
            'start_time' => $this->request->getJsonVar('start_time'),
            'end_time' => $this->request->getJsonVar('end_time'),
            'activity_name' => $this->request->getJsonVar('activity_name'),
            'notes' => $this->request->getJsonVar('notes')
        ];

        $EventsAgenda->update($id, $update_data);

        $data = $EventsAgenda->find($id);

        return $this->successOutput(['eventsagenda' => $data]);
    }


    /**
     * Delete EventsAgenda
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/eventsagenda/:id Delete EventsAgenda
     * @apiName Delete-EventsAgenda
     * @apiGroup EventsAgenda
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id EventsAgenda id
     */
    public function delete($id) {
        $EventsAgenda = new EventsAgenda();
        $EventsAgenda->delete($id);

        return $this->successOutput([], 200);
    }
}
