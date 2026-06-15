<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateEventFacilityArchitecture extends Migration
{
    public function up()
    {
      
         $this->forge->modifyColumn('users', [
            'eo_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | EVENTS ORGANIZER
        |--------------------------------------------------------------------------
        */

        $this->forge->addColumn('events_organizer', [
            'owner_user_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'id',
            ],
        ]);

        $this->db->query("
            ALTER TABLE events_organizer
            ADD INDEX idx_owner_user_id (owner_user_id)
        ");

        /*
        |--------------------------------------------------------------------------
        | FACILITIES
        |--------------------------------------------------------------------------
        */

        $this->forge->addColumn('facilities', [
            'owner_user_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'id',
            ],
        ]);

        $this->db->query("
            ALTER TABLE facilities
            ADD INDEX idx_owner_user_id (owner_user_id)
        ");

        /*
        |--------------------------------------------------------------------------
        | USER BUSINESS TYPES
        |--------------------------------------------------------------------------
        */

        $this->forge->addField([
            'id' => [
                'type'           => 'BIGINT',
                'constraint'     => 20,
                'unsigned'       => true,
                'auto_increment' => true,
            ],

            'user_id' => [
                'type'       => 'INT',
                'constraint' => 11,
            ],

            'business_type' => [
                'type'       => 'ENUM',
                'constraint' => ['EVENT', 'FACILITY'],
            ],

            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
                'default' => null,
            ],
        ]);

        $this->forge->addKey('id', true);

        $this->forge->addKey('user_id');
        $this->forge->createTable('user_business_types');

        /*
        |--------------------------------------------------------------------------
        | EVENTS TABLE UPDATE
        |--------------------------------------------------------------------------
        */

        $this->forge->addColumn('events', [
            'event_origin' => [
                'type'       => 'ENUM',
                'constraint' => [
                    'FACILITY',
                    'EXTERNAL',
                ],
                'default'    => 'EXTERNAL',
                'after'      => 'events_organizer_id',
            ],

            'facility_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'event_origin',
            ],
            

            'request_status_facility' => [
                'type'       => 'ENUM',
                'constraint' => [
                    'PENDING',
                    'APPROVED',
                    'REJECTED',
                ],
                'null'       => true,
                'default' => 'PENDING',
                'after'      => 'facility_id',
            ],

            'requested_facility_by' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'request_status_facility',
            ],

            'approved_facility_by' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'requested_facility_by',
            ],

            'approved_facility_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'approved_facility_by',
            ],

            'rejected_facility_reason' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'approved_facility_at',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | EVENTS INDEX
        |--------------------------------------------------------------------------
        */

        $this->db->query("
            ALTER TABLE events
            ADD INDEX idx_facility_id (facility_id)
        ");

        $this->db->query("
            ALTER TABLE events
            ADD INDEX idx_request_status_facility (request_status_facility)
        ");


        $this->forge->addColumn('facilities', [
            'latitude' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
            ],
            'longitude' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
            ],
            'address' => [
                'type'       => 'TEXT',
                'null'       => true,
            ],
        ]);

       $this->db->query("UPDATE events_organizer eo
                            JOIN users u
                                ON u.eo_id = eo.id
                            SET eo.owner_user_id = u.id
                            WHERE eo.owner_user_id IS NULL;");
        
        $this->db->query("UPDATE facilities f
                            JOIN events_organizer eo
                                ON eo.id = f.events_organizer_id
                            SET f.owner_user_id = eo.owner_user_id
                            WHERE f.owner_user_id IS NULL;");

        $this->db->query("INSERT IGNORE INTO user_business_types (
                                user_id,
                                business_type,
                                created_at
                            )
                            SELECT DISTINCT
                                owner_user_id,
                                'EVENT',
                                NOW()
                            FROM events_organizer
                            WHERE owner_user_id IS NOT NULL;");

        $this->db->query("INSERT IGNORE INTO user_business_types (
                                user_id,
                                business_type,
                                created_at
                            )
                            SELECT DISTINCT
                                owner_user_id,
                                'FACILITY',
                                NOW()
                            FROM facilities
                            WHERE owner_user_id IS NOT NULL;");

        $this->db->query("UPDATE events SET request_status_facility = 'APPROVED'");
       
    }

    public function down()
    {
        $this->forge->dropTable('user_business_types');

        $this->forge->dropColumn('events', [
            'event_origin',
            'facility_id',
            'request_status_facility',
            'requested_facility_by',
            'approved_facility_by',
            'approved_facility_at',
            'rejected_facility_reason',
        ]);

        $this->forge->dropColumn('events_organizer', [
            'owner_user_id',
        ]);

        $this->forge->dropColumn('facilities', [
            'owner_user_id',
            'latitude',
            'longitude',
            'address',
        ]);
    }
}