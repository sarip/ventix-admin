<?php

namespace App\Controllers;

use App\Models\FacilityBookingStatusModel;
use CodeIgniter\RESTful\ResourceController;

class FacilityBookingStatusController extends ResourceController
{
    protected $modelName = FacilityBookingStatusModel::class;
    protected $format = 'json';

    public function index()
    {
        $model = new FacilityBookingStatusModel();
        $statuses = $model->orderBy('id', 'ASC')->findAll();

        return $this->respond([
            'facility_booking_statuses' => $statuses
        ]);
    }

    public function show($id = null)
    {
        $model = new FacilityBookingStatusModel();
        $status = $model->find($id);

        if (!$status) {
            return $this->failNotFound('Status not found');
        }

        return $this->respond(['status' => $status]);
    }
}
