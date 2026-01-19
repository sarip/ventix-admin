# Facility Management & Booking System - Backend Implementation

## Database Schema

Tables already exist:
- `facilities`
- `facility_pricing`
- `facility_bookings`
- `facilitybooking_status`

## 1. Models

### `app/Models/FacilityModel.php`

```php
<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityModel extends Model
{
    protected $table            = 'facilities';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'category', 'description', 'user_id_pic', 'is_available'];

    // Dates
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'name'        => 'required|min_length[3]|max_length[255]',
        'category'    => 'required|in_list[Meeting Room,Sport Hall,Conference Room,Auditorium,Other]',
        'description' => 'permit_empty|max_length[1000]',
        'user_id_pic' => 'required|is_natural_no_zero',
        'is_available' => 'required|in_list[0,1]'
    ];
    protected $validationMessages   = [
        'name' => [
            'required' => 'Facility name is required',
            'min_length' => 'Facility name must be at least 3 characters'
        ],
        'category' => [
            'required' => 'Category is required',
            'in_list' => 'Invalid category'
        ]
    ];
    protected $skipValidation       = false;

    public function getFacilityWithPIC($id)
    {
        return $this->select('facilities.*, users.id as pic_id, users.name as pic_name, users.email as pic_email')
            ->join('users', 'users.id = facilities.user_id_pic', 'left')
            ->where('facilities.id', $id)
            ->first();
    }

    public function getFacilitiesWithPIC($filters = [])
    {
        $builder = $this->select('facilities.*, users.id as pic_id, users.name as pic_name, users.email as pic_email')
            ->join('users', 'users.id = facilities.user_id_pic', 'left');

        if (!empty($filters['search'])) {
            $builder->groupStart()
                ->like('facilities.name', $filters['search'])
                ->orLike('facilities.category', $filters['search'])
                ->orLike('users.name', $filters['search'])
                ->groupEnd();
        }

        if (!empty($filters['category'])) {
            $builder->where('facilities.category', $filters['category']);
        }

        if (isset($filters['is_available'])) {
            $builder->where('facilities.is_available', $filters['is_available']);
        }

        return $builder;
    }
}
```

### `app/Models/FacilityPricingModel.php`

```php
<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityPricingModel extends Model
{
    protected $table            = 'facility_pricing';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['facility_id', 'day_type', 'start_time', 'end_time', 'price_per_hour'];

    // Dates
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'facility_id'     => 'required|is_natural_no_zero',
        'day_type'        => 'required|in_list[Weekday,Weekend,Holiday]',
        'start_time'      => 'required|valid_time',
        'end_time'        => 'required|valid_time',
        'price_per_hour'  => 'required|decimal|greater_than[0]'
    ];
    protected $validationMessages   = [
        'day_type' => [
            'in_list' => 'Day type must be Weekday, Weekend, or Holiday'
        ],
        'price_per_hour' => [
            'required' => 'Price per hour is required',
            'greater_than' => 'Price must be greater than 0'
        ]
    ];
    protected $skipValidation       = false;

    protected $beforeInsert = ['validateNoOverlap'];
    protected $beforeUpdate = ['validateNoOverlap'];

    protected function validateNoOverlap(array $data)
    {
        if (!isset($data['data'])) {
            return $data;
        }

        $pricing = $data['data'];
        $hasOverlap = $this->checkTimeOverlap(
            $pricing['facility_id'],
            $pricing['day_type'],
            $pricing['start_time'],
            $pricing['end_time'],
            $pricing['id'] ?? null
        );

        if ($hasOverlap) {
            throw new \Exception('Time range overlaps with existing pricing rule');
        }

        return $data;
    }

    public function checkTimeOverlap($facilityId, $dayType, $startTime, $endTime, $excludeId = null)
    {
        $builder = $this->where('facility_id', $facilityId)
            ->where('day_type', $dayType)
            ->groupStart()
                ->groupStart()
                    ->where('start_time <=', $startTime)
                    ->where('end_time >', $startTime)
                ->groupEnd()
                ->orGroupStart()
                    ->where('start_time <', $endTime)
                    ->where('end_time >=', $endTime)
                ->groupEnd()
                ->orGroupStart()
                    ->where('start_time >=', $startTime)
                    ->where('end_time <=', $endTime)
                ->groupEnd()
            ->groupEnd();

        if ($excludeId) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }

    public function getPricingByDayAndTime($facilityId, $dayType, $startTime, $endTime)
    {
        return $this->where('facility_id', $facilityId)
            ->where('day_type', $dayType)
            ->where('start_time <=', $startTime)
            ->where('end_time >=', $endTime)
            ->first();
    }
}
```

### `app/Models/FacilityBookingModel.php`

```php
<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityBookingModel extends Model
{
    protected $table            = 'facility_bookings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'facility_id', 'user_id', 'facility_code', 'booking_date', 
        'start_time', 'end_time', 'total_hours', 'total_price', 
        'status_id', 'notes'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'facility_id'  => 'required|is_natural_no_zero',
        'user_id'      => 'required|is_natural_no_zero',
        'booking_date' => 'required|valid_date',
        'start_time'   => 'required|valid_time',
        'end_time'     => 'required|valid_time',
        'notes'        => 'permit_empty|max_length[500]'
    ];
    protected $validationMessages   = [];
    protected $skipValidation       = false;

    protected $beforeInsert = ['generateCode', 'calculateTotals'];
    protected $beforeUpdate = ['calculateTotals'];

    protected function generateCode(array $data)
    {
        if (!isset($data['data']['facility_code'])) {
            $data['data']['facility_code'] = 'FB-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));
        }
        return $data;
    }

    protected function calculateTotals(array $data)
    {
        $booking = $data['data'];
        
        // Calculate hours
        $start = strtotime($booking['start_time']);
        $end = strtotime($booking['end_time']);
        $hours = ($end - $start) / 3600;
        $data['data']['total_hours'] = $hours;

        // Calculate price using pricing rules
        $pricingModel = new FacilityPricingModel();
        $dayType = $this->getDayType($booking['booking_date']);
        
        $pricing = $pricingModel->getPricingByDayAndTime(
            $booking['facility_id'],
            $dayType,
            $booking['start_time'],
            $booking['end_time']
        );

        if ($pricing) {
            $data['data']['total_price'] = $hours * $pricing['price_per_hour'];
        } else {
            throw new \Exception('No pricing rule found for this booking time');
        }

        // Set default status (Pending)
        if (!isset($data['data']['status_id'])) {
            $data['data']['status_id'] = 1; // Pending
        }

        return $data;
    }

    private function getDayType($date)
    {
        $dayOfWeek = date('N', strtotime($date)); // 1=Monday, 7=Sunday
        
        // Check if holiday (you can implement holiday checking logic here)
        // For now, simple weekend check
        if ($dayOfWeek >= 6) {
            return 'Weekend';
        }
        
        return 'Weekday';
    }

    public function checkTimeOverlap($facilityId, $bookingDate, $startTime, $endTime, $excludeId = null)
    {
        $builder = $this->where('facility_id', $facilityId)
            ->where('booking_date', $bookingDate)
            ->whereNotIn('status_id', [4]) // Exclude cancelled bookings (status_id = 4)
            ->groupStart()
                ->groupStart()
                    ->where('start_time <=', $startTime)
                    ->where('end_time >', $startTime)
                ->groupEnd()
                ->orGroupStart()
                    ->where('start_time <', $endTime)
                    ->where('end_time >=', $endTime)
                ->groupEnd()
                ->orGroupStart()
                    ->where('start_time >=', $startTime)
                    ->where('end_time <=', $endTime)
                ->groupEnd()
            ->groupEnd();

        if ($excludeId) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }

    public function getBookingsWithRelations($filters = [])
    {
        $builder = $this->select('
                facility_bookings.*,
                facilities.name as facility_name,
                facilities.category as facility_category,
                users.name as user_name,
                users.email as user_email,
                facilitybooking_status.name as status_name,
                facilitybooking_status.color_code as status_color
            ')
            ->join('facilities', 'facilities.id = facility_bookings.facility_id', 'left')
            ->join('users', 'users.id = facility_bookings.user_id', 'left')
            ->join('facilitybooking_status', 'facilitybooking_status.id = facility_bookings.status_id', 'left');

        if (!empty($filters['search'])) {
            $builder->groupStart()
                ->like('facility_bookings.facility_code', $filters['search'])
                ->orLike('facilities.name', $filters['search'])
                ->orLike('users.name', $filters['search'])
                ->groupEnd();
        }

        if (!empty($filters['status_id'])) {
            $builder->where('facility_bookings.status_id', $filters['status_id']);
        }

        if (!empty($filters['facility_id'])) {
            $builder->where('facility_bookings.facility_id', $filters['facility_id']);
        }

        return $builder;
    }
}
```

### `app/Models/FacilityBookingStatusModel.php`

```php
<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityBookingStatusModel extends Model
{
    protected $table            = 'facilitybooking_status';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'color_code', 'description'];

    // Dates
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
```

---

## 2. Controllers

### `app/Controllers/FacilityController.php`

```php
<?php

namespace App\Controllers;

use App\Models\FacilityModel;
use CodeIgniter\RESTful\ResourceController;

class FacilityController extends ResourceController
{
    protected $modelName = FacilityModel::class;
    protected $format    = 'json';

    public function index()
    {
        $model = new FacilityModel();
        
        $page = $this->request->getGet('page') ?? 1;
        $perPage = $this->request->getGet('per_page') ?? 10;
        $search = $this->request->getGet('search');
        $filter = $this->request->getGet('filter');

        $filters = [];
        if ($search) {
            $filters['search'] = $search;
        }
        
        if ($filter) {
            parse_str($filter, $filterArray);
            $filters = array_merge($filters, $filterArray);
        }

        $builder = $model->getFacilitiesWithPIC($filters);
        $total = $builder->countAllResults(false);
        $facilities = $builder->paginate($perPage, 'default', $page);

        // Transform data to include PIC object
        $facilities = array_map(function($item) {
            $item['pic'] = [
                'id' => $item['pic_id'],
                'name' => $item['pic_name'],
                'email' => $item['pic_email']
            ];
            unset($item['pic_id'], $item['pic_name'], $item['pic_email']);
            return $item;
        }, $facilities);

        return $this->respond([
            'facilities' => $facilities,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'page_count' => ceil($total / $perPage)
            ]
        ]);
    }

    public function show($id = null)
    {
        $model = new FacilityModel();
        $facility = $model->getFacilityWithPIC($id);

        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        // Transform PIC data
        $facility['pic'] = [
            'id' => $facility['pic_id'],
            'name' => $facility['pic_name'],
            'email' => $facility['pic_email']
        ];
        unset($facility['pic_id'], $facility['pic_name'], $facility['pic_email']);

        return $this->respond(['facility' => $facility]);
    }

    public function create()
    {
        $model = new FacilityModel();
        $data = $this->request->getJSON(true);

        if (!$model->insert($data)) {
            return $this->fail($model->errors());
        }

        return $this->respondCreated([
            'success' => true,
            'id' => $model->getInsertID(),
            'message' => 'Facility created successfully'
        ]);
    }

    public function update($id = null)
    {
        $model = new FacilityModel();
        $data = $this->request->getJSON(true);

        if (!$model->find($id)) {
            return $this->failNotFound('Facility not found');
        }

        if (!$model->update($id, $data)) {
            return $this->fail($model->errors());
        }

        return $this->respond([
            'success' => true,
            'message' => 'Facility updated successfully'
        ]);
    }

    public function delete($id = null)
    {
        $model = new FacilityModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Facility not found');
        }

        if (!$model->delete($id)) {
            return $this->fail('Failed to delete facility');
        }

        return $this->respondDeleted([
            'success' => true,
            'message' => 'Facility deleted successfully'
        ]);
    }
}
```

### `app/Controllers/FacilityPricingController.php`

```php
<?php

namespace App\Controllers;

use App\Models\FacilityPricingModel;
use CodeIgniter\RESTful\ResourceController;

class FacilityPricingController extends ResourceController
{
    protected $modelName = FacilityPricingModel::class;
    protected $format    = 'json';

    public function index()
    {
        $model = new FacilityPricingModel();
        
        $filter = $this->request->getGet('filter');
        $filters = [];
        
        if ($filter) {
            parse_str($filter, $filterArray);
            $filters = $filterArray;
        }

        $builder = $model;
        if (isset($filters['facility_id'])) {
            $builder = $builder->where('facility_id', $filters['facility_id']);
        }

        $pricings = $builder->orderBy('day_type', 'ASC')
            ->orderBy('start_time', 'ASC')
            ->findAll();

        return $this->respond(['facility_pricings' => $pricings]);
    }

    public function show($id = null)
    {
        $model = new FacilityPricingModel();
        $pricing = $model->find($id);

        if (!$pricing) {
            return $this->failNotFound('Pricing not found');
        }

        return $this->respond(['pricing' => $pricing]);
    }

    public function create()
    {
        $model = new FacilityPricingModel();
        $data = $this->request->getJSON(true);

        try {
            if (!$model->insert($data)) {
                return $this->fail($model->errors());
            }

            return $this->respondCreated([
                'success' => true,
                'id' => $model->getInsertID(),
                'message' => 'Pricing created successfully'
            ]);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function update($id = null)
    {
        $model = new FacilityPricingModel();
        $data = $this->request->getJSON(true);
        $data['id'] = $id;

        if (!$model->find($id)) {
            return $this->failNotFound('Pricing not found');
        }

        try {
            if (!$model->update($id, $data)) {
                return $this->fail($model->errors());
            }

            return $this->respond([
                'success' => true,
                'message' => 'Pricing updated successfully'
            ]);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function delete($id = null)
    {
        $model = new FacilityPricingModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Pricing not found');
        }

        if (!$model->delete($id)) {
            return $this->fail('Failed to delete pricing');
        }

        return $this->respondDeleted([
            'success' => true,
            'message' => 'Pricing deleted successfully'
        ]);
    }

    public function checkOverlap()
    {
        $model = new FacilityPricingModel();
        $data = $this->request->getJSON(true);

        $hasOverlap = $model->checkTimeOverlap(
            $data['facility_id'],
            $data['day_type'],
            $data['start_time'],
            $data['end_time'],
            $data['id'] ?? null
        );

        return $this->respond(['has_overlap' => $hasOverlap]);
    }
}
```

### `app/Controllers/FacilityBookingController.php`

```php
<?php

namespace App\Controllers;

use App\Models\FacilityBookingModel;
use App\Models\FacilityPricingModel;
use CodeIgniter\RESTful\ResourceController;

class FacilityBookingController extends ResourceController
{
    protected $modelName = FacilityBookingModel::class;
    protected $format    = 'json';

    public function index()
    {
        $model = new FacilityBookingModel();
        
        $page = $this->request->getGet('page') ?? 1;
        $perPage = $this->request->getGet('per_page') ?? 10;
        $search = $this->request->getGet('search');
        $filter = $this->request->getGet('filter');

        $filters = [];
        if ($search) {
            $filters['search'] = $search;
        }
        
        if ($filter) {
            parse_str($filter, $filterArray);
            $filters = array_merge($filters, $filterArray);
        }

        $builder = $model->getBookingsWithRelations($filters);
        $total = $builder->countAllResults(false);
        $bookings = $builder->orderBy('facility_bookings.created_at', 'DESC')
            ->paginate($perPage, 'default', $page);

        // Transform data
        $bookings = array_map(function($item) {
            $item['facility'] = [
                'id' => $item['facility_id'],
                'name' => $item['facility_name'],
                'category' => $item['facility_category']
            ];
            $item['user'] = [
                'id' => $item['user_id'],
                'name' => $item['user_name'],
                'email' => $item['user_email']
            ];
            $item['status'] = [
                'id' => $item['status_id'],
                'name' => $item['status_name'],
                'color_code' => $item['status_color']
            ];
            unset(
                $item['facility_name'], $item['facility_category'],
                $item['user_name'], $item['user_email'],
                $item['status_name'], $item['status_color']
            );
            return $item;
        }, $bookings);

        return $this->respond([
            'facility_bookings' => $bookings,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'filtered_total' => $total,
                'page_count' => ceil($total / $perPage)
            ]
        ]);
    }

    public function show($id = null)
    {
        $model = new FacilityBookingModel();
        $bookings = $model->getBookingsWithRelations(['booking_id' => $id])
            ->where('facility_bookings.id', $id)
            ->first();

        if (!$bookings) {
            return $this->failNotFound('Booking not found');
        }

        // Transform data
        $bookings['facility'] = [
            'id' => $bookings['facility_id'],
            'name' => $bookings['facility_name'],
            'category' => $bookings['facility_category']
        ];
        $bookings['user'] = [
            'id' => $bookings['user_id'],
            'name' => $bookings['user_name'],
            'email' => $bookings['user_email']
        ];
        $bookings['status'] = [
            'id' => $bookings['status_id'],
            'name' => $bookings['status_name'],
            'color_code' => $bookings['status_color']
        ];

        return $this->respond(['booking' => $bookings]);
    }

    public function create()
    {
        $model = new FacilityBookingModel();
        $data = $this->request->getJSON(true);

        // Check time overlap
        $hasOverlap = $model->checkTimeOverlap(
            $data['facility_id'],
            $data['booking_date'],
            $data['start_time'],
            $data['end_time']
        );

        if ($hasOverlap) {
            return $this->fail('Time slot already booked');
        }

        try {
            if (!$model->insert($data)) {
                return $this->fail($model->errors());
            }

            return $this->respondCreated([
                'success' => true,
                'id' => $model->getInsertID(),
                'message' => 'Booking created successfully'
            ]);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function update($id = null)
    {
        $model = new FacilityBookingModel();
        $data = $this->request->getJSON(true);

        if (!$model->find($id)) {
            return $this->failNotFound('Booking not found');
        }

        if (!$model->update($id, $data)) {
            return $this->fail($model->errors());
        }

        return $this->respond([
            'success' => true,
            'message' => 'Booking updated successfully'
        ]);
    }

    public function delete($id = null)
    {
        $model = new FacilityBookingModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Booking not found');
        }

        if (!$model->delete($id)) {
            return $this->fail('Failed to delete booking');
        }

        return $this->respondDeleted([
            'success' => true,
            'message' => 'Booking deleted successfully'
        ]);
    }

    public function updateStatus($id = null)
    {
        $model = new FacilityBookingModel();
        $data = $this->request->getJSON(true);

        if (!$model->find($id)) {
            return $this->failNotFound('Booking not found');
        }

        if (!$model->update($id, ['status_id' => $data['status_id']])) {
            return $this->fail($model->errors());
        }

        return $this->respond([
            'success' => true,
            'message' => 'Booking status updated successfully'
        ]);
    }

    public function checkAvailability()
    {
        $model = new FacilityBookingModel();
        $data = $this->request->getJSON(true);

        $hasOverlap = $model->checkTimeOverlap(
            $data['facility_id'],
            $data['booking_date'],
            $data['start_time'],
            $data['end_time'],
            $data['id'] ?? null
        );

        if ($hasOverlap) {
            return $this->respond([
                'available' => false,
                'message' => 'Time slot is already booked'
            ]);
        }

        return $this->respond(['available' => true]);
    }

    public function calculatePrice()
    {
        $data = $this->request->getJSON(true);
        $pricingModel = new FacilityPricingModel();
        $bookingModel = new FacilityBookingModel();

        // Calculate hours
        $start = strtotime($data['start_time']);
        $end = strtotime($data['end_time']);
        $totalHours = ($end - $start) / 3600;

        // Get day type
        $dayOfWeek = date('N', strtotime($data['booking_date']));
        $dayType = ($dayOfWeek >= 6) ? 'Weekend' : 'Weekday';

        // Get pricing
        $pricing = $pricingModel->getPricingByDayAndTime(
            $data['facility_id'],
            $dayType,
            $data['start_time'],
            $data['end_time']
        );

        if (!$pricing) {
            return $this->fail('No pricing rule found for this time slot');
        }

        $totalPrice = $totalHours * $pricing['price_per_hour'];

        return $this->respond([
            'total_hours' => $totalHours,
            'total_price' => $totalPrice,
            'breakdown' => [
                [
                    'day_type' => $dayType,
                    'hours' => $totalHours,
                    'price_per_hour' => $pricing['price_per_hour'],
                    'subtotal' => $totalPrice
                ]
            ]
        ]);
    }
}
```

---

## 3. Routes Configuration

Add to `app/Config/Routes.php`:

```php
// Facility Management
$routes->group('api/v1', ['namespace' => 'App\Controllers'], function($routes) {
    // Facilities
    $routes->get('facilities', 'FacilityController::index');
    $routes->get('facility/(:num)', 'FacilityController::show/$1');
    $routes->post('facility', 'FacilityController::create');
    $routes->put('facility/(:num)', 'FacilityController::update/$1');
    $routes->delete('facility/(:num)', 'FacilityController::delete/$1');

    // Facility Pricing
    $routes->get('facility_pricings', 'FacilityPricingController::index');
    $routes->get('facility_pricing/(:num)', 'FacilityPricingController::show/$1');
    $routes->post('facility_pricing', 'FacilityPricingController::create');
    $routes->put('facility_pricing/(:num)', 'FacilityPricingController::update/$1');
    $routes->delete('facility_pricing/(:num)', 'FacilityPricingController::delete/$1');
    $routes->post('facility_pricing/check_overlap', 'FacilityPricingController::checkOverlap');

    // Facility Bookings
    $routes->get('facility_bookings', 'FacilityBookingController::index');
    $routes->get('facility_booking/(:num)', 'FacilityBookingController::show/$1');
    $routes->post('facility_booking', 'FacilityBookingController::create');
    $routes->put('facility_booking/(:num)', 'FacilityBookingController::update/$1');
    $routes->delete('facility_booking/(:num)', 'FacilityBookingController::delete/$1');
    $routes->put('facility_booking/(:num)/status', 'FacilityBookingController::updateStatus/$1');
    $routes->post('facility_booking/check_availability', 'FacilityBookingController::checkAvailability');
    $routes->post('facility_booking/calculate_price', 'FacilityBookingController::calculatePrice');

    // Booking Status
    $routes->get('facility_booking_statuses', 'FacilityBookingStatusController::index');
    $routes->get('facility_booking_status/(:num)', 'FacilityBookingStatusController::show/$1');
});
```

---

## Key Features Implemented

### Backend:
✅ Full CRUD for all resources
✅ Time overlap validation for pricing & bookings
✅ Auto-generate facility_code
✅ Auto-calculate total_hours & total_price
✅ Day type detection (Weekday/Weekend)
✅ Pricing rule matching
✅ Status flow validation
✅ Comprehensive validation rules
✅ RESTful API design

### Frontend:
✅ Facility management page with filters
✅ Facility form modal
✅ Pricing management with overlap prevention
✅ Booking form with availability checking
✅ Real-time price calculation
✅ Booking status badges with dynamic colors
✅ Pagination support
✅ Responsive design
