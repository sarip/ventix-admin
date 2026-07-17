<?php

namespace App\Database\Seeds;

use App\Models\FacilityAmenity;
use CodeIgniter\Database\Seeder;

class FacilityAmenitiesSeeder extends Seeder
{
    public function run()
    {
        $data = [

    // General
    ['name'=>'Parking','description'=>'Parking area available','icon'=>'fa-solid fa-square-parking'],
    ['name'=>'VIP Parking','description'=>'VIP parking available','icon'=>'fa-solid fa-car'],
    ['name'=>'WiFi','description'=>'Free wireless internet','icon'=>'fa-solid fa-wifi'],
    ['name'=>'Air Conditioner','description'=>'Air conditioned area','icon'=>'fa-solid fa-fan'],
    ['name'=>'Waiting Room','description'=>'Waiting room available','icon'=>'fa-solid fa-couch'],
    ['name'=>'Security','description'=>'Security service available','icon'=>'fa-solid fa-shield-halved'],
    ['name'=>'CCTV','description'=>'24 hour CCTV monitoring','icon'=>'fa-solid fa-video'],
    ['name'=>'First Aid','description'=>'First aid facility','icon'=>'fa-solid fa-kit-medical'],

    // Religious
    ['name'=>'Mushola','description'=>'Prayer room available','icon'=>'fa-solid fa-mosque'],

    // Sports
    ['name'=>'Locker','description'=>'Locker facility','icon'=>'fa-solid fa-lock'],
    ['name'=>'Shower','description'=>'Shower room available','icon'=>'fa-solid fa-shower'],
    ['name'=>'Changing Room','description'=>'Changing room available','icon'=>'fa-solid fa-shirt'],
    ['name'=>'Tribune','description'=>'Audience tribune','icon'=>'fa-solid fa-users'],
    ['name'=>'Scoreboard','description'=>'Electronic scoreboard','icon'=>'fa-solid fa-table-list'],

    // Food
    ['name'=>'Cafe','description'=>'Cafe available','icon'=>'fa-solid fa-mug-hot'],
    ['name'=>'Restaurant','description'=>'Restaurant available','icon'=>'fa-solid fa-utensils'],
    ['name'=>'Food Court','description'=>'Food court available','icon'=>'fa-solid fa-bowl-food'],

    // Event
    ['name'=>'Sound System','description'=>'Professional sound system','icon'=>'fa-solid fa-volume-high'],
    ['name'=>'Stage','description'=>'Performance stage','icon'=>'fa-solid fa-microphone'],
    ['name'=>'LED Screen','description'=>'LED display screen','icon'=>'fa-solid fa-tv'],
    ['name'=>'Projector','description'=>'Projector available','icon'=>'fa-solid fa-video'],
    ['name'=>'Live Streaming','description'=>'Live streaming support','icon'=>'fa-solid fa-tower-broadcast'],
    ['name'=>'Backstage Room','description'=>'Backstage room','icon'=>'fa-solid fa-users-rectangle'],
    ['name'=>'Dressing Room','description'=>'Dressing room','icon'=>'fa-solid fa-user-pen'],

    // Business
    ['name'=>'Meeting Room','description'=>'Meeting room available','icon'=>'fa-solid fa-person-chalkboard'],
    ['name'=>'Conference Room','description'=>'Conference room available','icon'=>'fa-solid fa-people-group'],

    // Accessibility
    ['name'=>'Wheelchair Access','description'=>'Wheelchair accessible','icon'=>'fa-solid fa-wheelchair'],
    ['name'=>'Elevator','description'=>'Elevator available','icon'=>'fa-solid fa-elevator'],
    ['name'=>'Escalator','description'=>'Escalator available','icon'=>'fa-solid fa-stairs'],

    // Utilities
    ['name'=>'ATM','description'=>'ATM available','icon'=>'fa-solid fa-money-bill'],
    ['name'=>'Charging Station','description'=>'Charging station available','icon'=>'fa-solid fa-charging-station'],
    ['name'=>'Generator','description'=>'Backup generator','icon'=>'fa-solid fa-bolt'],
    ['name'=>'Internet LAN','description'=>'LAN internet connection','icon'=>'fa-solid fa-network-wired'],

    // Retail
    ['name'=>'Merchandise Store','description'=>'Merchandise store available','icon'=>'fa-solid fa-bag-shopping'],

    // Family
    ['name'=>'Kids Area','description'=>'Kids area available','icon'=>'fa-solid fa-child-reaching'],
    ['name'=>'Pet Friendly','description'=>'Pet friendly area','icon'=>'fa-solid fa-paw'],

    // Premium
    ['name'=>'VIP Room','description'=>'VIP room available','icon'=>'fa-solid fa-crown'],
    ['name'=>'VIP Lounge','description'=>'VIP lounge available','icon'=>'fa-solid fa-champagne-glasses'],

    // Fitness
    ['name'=>'Gym','description'=>'Gym facility','icon'=>'fa-solid fa-dumbbell'],
    ['name'=>'Swimming Pool','description'=>'Swimming pool available','icon'=>'fa-solid fa-person-swimming'],

    // Misc
    ['name'=>'Smoking Area','description'=>'Smoking area available','icon'=>'fa-solid fa-smoking'],
    ['name'=>'Toilet','description'=>'Public toilet','icon'=>'fa-solid fa-restroom'],
];

        $Model = new FacilityAmenity();
        $Model->truncate(); // Clear existing data before seeding
        $Model->insertBatch($data);
    }
}