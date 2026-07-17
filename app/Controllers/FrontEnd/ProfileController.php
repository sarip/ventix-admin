<?php

namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Models\Role;
use App\Models\SysUsersRole;
use App\Models\User;
use App\Models\MemberFollow;
use App\Models\MemberExperience;
use App\Models\MemberRating;
use App\Models\EventsOrganizer;
use App\Models\Facilitie;
use Config\Services;
use App\Models\Notification;
use CodeIgniter\API\ResponseTrait;

class ProfileController extends ApiController
{
    use ResponseTrait;

    protected $userModel;
    protected $followModel;
    protected $experienceModel;
    protected $ratingModel;
    protected $notificationModel;

    public function __construct()
    {
        parent::__construct();
        $this->userModel = new User();
        $this->followModel = new MemberFollow();
        $this->experienceModel = new MemberExperience();
        $this->ratingModel = new MemberRating();
        $this->notificationModel = new Notification();
    }

    /**
     * Get public profile by username
     */
    public function show($username)
    {
        $user = $this->userModel->where('username', $username)->first();
        if (!$user) {
            return $this->failNotFound('User not found');
        }

        // Basic profile data
        $profile = [
            'id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'profile_picture' => $user->profile_picture,
            'cover_photo' => $user->cover_photo,
            'bio' => $user->bio,
            'role' => $user->role,
        ];

        // Followers & Following count
        $profile['followers_count'] = $this->followModel->where(['following_id' => $user->id, 'following_type' => 'MEMBER'])->countAllResults();
        $profile['following_count'] = $this->followModel->where(['follower_id' => $user->id])->countAllResults();

        // Apakah user yang login sudah follow member ini
        $authUserId = $this->request->id;
        $profile['is_following'] = $authUserId
            ? (bool) $this->followModel->where([
                'follower_id' => $authUserId,
                'following_id' => $user->id,
                'following_type' => 'MEMBER',
            ])->first()
            : false;

        // Experiences
        $profile['experiences'] = $this->experienceModel->getPublicByUserId($user->id);

        // Ratings (if allowed)
        // if ($user->show_ratings) {
        $profile['ratings'] = $this->ratingModel->getPublicByUserId($user->id);
        $avgRow = $this->ratingModel
            ->selectAvg('rating', 'average_rating')
            ->where('user_id', $user->id)
            ->where('is_public', 1)
            ->first();
        $profile['average_rating'] = $avgRow ? round((float) $avgRow->average_rating, 1) : null;
        // } else {
        //     $profile['ratings'] = [];
        //     $profile['average_rating'] = null;
        // }

        return $this->successOutput(['profile' => $profile]);
    }

    public function update()
    {
        $userId = $this->request->id;
        if (!$userId) {
            return $this->failUnauthorized();
        }

        $data = [
            'bio' => $this->request->getPost('bio'),
            'show_ratings' => $this->request->getPost('show_ratings'),
        ];

        // Handle file uploads for profile_picture
        $profilePictureFile = $this->request->getFile('profile_picture');
        if ($profilePictureFile && $profilePictureFile->isValid() && !$profilePictureFile->hasMoved()) {
            $newName = $profilePictureFile->getRandomName();
            $profilePictureFile->move(FCPATH . 'uploads/profile', $newName);

            $user = $this->userModel->find($userId);
            if ($user && !empty($user->profile_picture)) {
                $oldPath = FCPATH . 'uploads/profile/' . $user->profile_picture;
                if (file_exists($oldPath))
                    @unlink($oldPath);
            }
            $data['profile_picture'] = $newName;
        }

        // Handle file uploads for cover_photo
        $coverPhotoFile = $this->request->getFile('cover_photo');
        if ($coverPhotoFile && $coverPhotoFile->isValid() && !$coverPhotoFile->hasMoved()) {
            $newName = $coverPhotoFile->getRandomName();
            $coverPhotoFile->move(FCPATH . 'uploads/profile', $newName);

            $user = $this->userModel->find($userId);
            if ($user && !empty($user->cover_photo)) {
                $oldPath = FCPATH . 'uploads/profile/' . $user->cover_photo;
                if (file_exists($oldPath))
                    @unlink($oldPath);
            }
            $data['cover_photo'] = $newName;
        }

        $data = array_filter($data, function ($value) {
            return $value !== null;
        });

        if ($this->userModel->update($userId, $data)) {
            $updatedUser = $this->userModel->find($userId);
            if ($updatedUser->profile_picture)
                $updatedUser->profile_picture = base_url('uploads/profile/' . $updatedUser->profile_picture);
            if ($updatedUser->cover_photo)
                $updatedUser->cover_photo = base_url('uploads/profile/' . $updatedUser->cover_photo);

            return $this->successOutput(['message' => 'Profile updated successfully', 'user' => $updatedUser]);
        }

        return $this->failValidationErrors($this->userModel->errors());
    }

    /**
     * Toggle Follow
     */
    public function follow()
    {
        $follower_id = $this->request->id;
        $following_id = $this->request->getJsonVar('following_id');
        $following_type = $this->request->getJsonVar('following_type'); // EO, FACILITY, MEMBER

        if (!$follower_id || !$following_id || !$following_type) {
            return $this->fail('Invalid parameters');
        }

        $existing = $this->followModel->where([
            'follower_id' => $follower_id,
            'following_id' => $following_id,
            'following_type' => $following_type
        ])->first();

        if ($existing) {
            $this->followModel->delete($existing->id);
            return $this->successOutput(['message' => 'Unfollowed', 'status' => 'unfollowed']);
        } else {
            $this->followModel->insert([
                'follower_id' => $follower_id,
                'following_id' => $following_id,
                'following_type' => $following_type,
            ]);

            // Kirim notifikasi hanya ketika follow sesama member
            if ($following_type === 'MEMBER') {
                $follower = $this->userModel->find($follower_id);
                $this->notificationModel->insert([
                    'user_id' => $following_id,
                    'type' => 'new_follower',
                    'entity_type' => 'MEMBER',
                    'entity_id' => $follower_id,
                    'title' => 'Follower Baru',
                    'message' => ($follower->name ?? $follower->username) . ' mulai mengikuti kamu.',
                    'is_read' => 0,
                    'sent_at' => date('Y-m-d H:i:s'),
                ]);
            }

            return $this->successOutput(['message' => 'Followed', 'status' => 'followed']);
        }
    }

    /**
     * Get Following List
     */
    public function following($identifier = null)
    {
        $userId = $this->request->id;

        if ($identifier) {
            $user = $this->userModel->where('id', $identifier)->orWhere('username', $identifier)->first();
            if ($user) {
                $userId = $user->id;
            } else {
                return $this->failNotFound('User not found');
            }
        }

        $searchable_column = [
            'search' => ['following_type'],
        ];

        // Execute search filter
        $output = \App\Filters\SearchFilter::execute($this->followModel, $searchable_column, 'member_follows', ['follower_id' => $userId]);

        // Enrich data
        array_walk($output['member_follows'], function (&$item) {
            if ($item->following_type === 'EO') {
                $eo = (new EventsOrganizer())->find($item->following_id);
                $item->details = $eo ? ['name' => $eo->eo_name, 'image' => $eo->logo] : null;
            } elseif ($item->following_type === 'FACILITY') {
                $fac = (new Facilitie())->find($item->following_id);
                $item->details = $fac ? ['name' => $fac->name, 'image' => null] : null; // Updated as facility might not have image directly
            } elseif ($item->following_type === 'MEMBER') {
                $user = (new User())->find($item->following_id);
                if ($user) {
                    $item->details = ['name' => $user->name, 'username' => $user->username, 'image' => $user->profile_picture];
                } else {
                    $item->details = null;
                }
            }
        });

        return $this->successOutput($output);
    }

    /**
     * Get Followers List
     */
    public function followers($identifier = null)
    {
        $userId = $this->request->id;

        if ($identifier) {
            $user = $this->userModel->where('id', $identifier)->orWhere('username', $identifier)->first();
            if ($user) {
                $userId = $user->id;
            } else {
                return $this->failNotFound('User not found');
            }
        }

        $searchable_column = [
            'search' => [],
        ];

        // We only care about users following this MEMBER
        // Execute search filter
        $output = \App\Filters\SearchFilter::execute($this->followModel, $searchable_column, 'member_follows', [
            'following_id' => $userId,
            'following_type' => 'MEMBER'
        ]);

        // Enrich data (who is following this user)
        array_walk($output['member_follows'], function (&$item) {
            $user = (new User())->find($item->follower_id);
            if ($user) {
                $item->details = ['name' => $user->name, 'username' => $user->username, 'image' => $user->profile_picture ];
            } else {
                $item->details = null;
            }
        });

        return $this->successOutput($output);
    }

    /**
     * Get Experiences List
     */
    public function experiences($identifier = null)
    {
        $userId = $this->request->id;

        if ($identifier) {
            $user = $this->userModel->where('id', $identifier)->orWhere('username', $identifier)->first();
            if ($user) {
                $userId = $user->id;
            } else {
                return $this->failNotFound('User not found');
            }
        }

        $searchable_column = [
            'search' => ['title', 'description', 'type'],
        ];

        $filter = ['user_id' => $userId];

        // If viewing someone else, only show public experiences
        if ($identifier && $userId != $this->request->id) {
            $filter['is_public'] = 1;
        }

        // Execute search filter
        $output = \App\Filters\SearchFilter::execute($this->experienceModel, $searchable_column, 'member_experiences', $filter);

        return $this->successOutput($output);
    }

    /**
     * Manage Experiences List (Create/Update/Delete)
     */
    public function experience()
    {
        $userId = $this->request->id;
        $id = $this->request->getJsonVar('id');
        $action = $this->request->getJsonVar('action'); // add, update, delete, toggle_visibility

        if ($action === 'add') {
            $data = [
                'user_id' => $userId,
                'title' => $this->request->getJsonVar('title'),
                'description' => $this->request->getJsonVar('description'),
                'date' => $this->request->getJsonVar('date'),
                'type' => $this->request->getJsonVar('type') ?? 'MANUAL',
                'reference_id' => $this->request->getJsonVar('reference_id'),
                'is_public' => $this->request->getJsonVar('is_public') ?? 1,
            ];
            $this->experienceModel->insert($data);
            return $this->successOutput(['message' => 'Experience added']);
        }

        if (!$id)
            return $this->fail('ID required');
        $exp = $this->experienceModel->find($id);
        if (!$exp || $exp->user_id != $userId)
            return $this->failForbidden();

        if ($action === 'delete') {
            $this->experienceModel->delete($id);
            return $this->successOutput(['message' => 'Experience deleted']);
        }

        if ($action === 'toggle_visibility') {
            $this->experienceModel->update($id, ['is_public' => !$exp->is_public]);
            return $this->successOutput(['message' => 'Visibility updated', 'is_public' => !$exp->is_public]);
        }

        if ($action === 'update') {
            $data = [
                'title' => $this->request->getJsonVar('title'),
                'description' => $this->request->getJsonVar('description'),
                'date' => $this->request->getJsonVar('date'),
                'is_public' => $this->request->getJsonVar('is_public'),
            ];
            $this->experienceModel->update($id, array_filter($data));
            return $this->successOutput(['message' => 'Experience updated']);
        }

        return $this->fail('Invalid action');
    }

    /**
     * Get Ratings/Reviews List
     */
    public function ratings($identifier = null)
    {
        $userId = $this->request->id;

        if ($identifier) {
            $user = $this->userModel->where('id', $identifier)->orWhere('username', $identifier)->first();
            if ($user) {
                $userId = $user->id;
            } else {
                return $this->failNotFound('User not found');
            }
        }

        $searchable_column = [
            'search' => ['target_type', 'comment'],
        ];

        $filter = ['user_id' => $userId];

        // If viewing someone else, only show public ratings
        if ($identifier && $userId != $this->request->id) {
            $filter['is_public'] = 1;
        }

        // Execute search filter
        $output = \App\Filters\SearchFilter::execute($this->ratingModel, $searchable_column, 'member_ratings', $filter);

        // Fetch target details
        array_walk($output['member_ratings'], function (&$item) {
            if ($item->target_type === 'EVENT') {
                $event = (new \App\Models\Event())->find($item->target_id);
                $item->target_details = $event ? ['title' => $event->title, 'thumbnail' => $event->thumbnail_url ? base_url('uploads/event/' . $event->thumbnail_url) : null] : null;
            } elseif ($item->target_type === 'FACILITY') {
                $fac = (new Facilitie())->find($item->target_id);
                $item->target_details = $fac ? ['name' => $fac->name, 'image' => null] : null;
            }
        });

        return $this->successOutput($output);
    }

    /**
     * Manage Ratings
     */
    public function rating()
    {
        $userId = $this->request->id;
        $id = $this->request->getJsonVar('id');
        $action = $this->request->getJsonVar('action'); // add, update, delete, toggle_visibility

        if ($action === 'add') {
            $data = [
                'user_id' => $userId,
                'target_id' => $this->request->getJsonVar('target_id'),
                'target_type' => $this->request->getJsonVar('target_type'),
                'rating' => $this->request->getJsonVar('rating'),
                'comment' => $this->request->getJsonVar('comment'),
                'is_public' => $this->request->getJsonVar('is_public') ?? 0,
            ];
            $this->ratingModel->insert($data);
            return $this->successOutput(['message' => 'Rating added']);
        }

        if (!$id)
            return $this->fail('ID required');
        $rating = $this->ratingModel->find($id);
        if (!$rating || $rating->user_id != $userId)
            return $this->failForbidden();

        if ($action === 'delete') {
            $this->ratingModel->delete($id);
            return $this->successOutput(['message' => 'Rating deleted']);
        }

        if ($action === 'toggle_visibility') {
            $this->ratingModel->update($id, ['is_public' => !$rating->is_public]);
            return $this->successOutput(['message' => 'Visibility updated', 'is_public' => !$rating->is_public]);
        }

        return $this->fail('Invalid action');
    }

    /**
     * Get Activity Summary (Counts)
     */
    public function activitySummary($identifier = null)
    {
        $userId = $this->request->id;
        $isOwner = true;

        if ($identifier) {
            $user = $this->userModel->where('id', $identifier)->orWhere('username', $identifier)->first();
            if ($user) {
                $userId = $user->id;
                $isOwner = ($userId == $this->request->id);
                $show_ratings = (bool) $user->show_ratings;
            } else {
                return $this->failNotFound('User not found');
            }
        } else {
            $show_ratings = true;
        }

        // 1. Events Attended — from user_tickets
        $events_attended_count = (new \App\Models\UserTicket())
            ->where('user_id', $userId)
            ->countAllResults();

        // 2. Facilities Rented — from facility_bookings
        $facilities_rented_count = (new \App\Models\FacilityBooking())
            ->where('user_id', $userId)
            ->countAllResults();

        // 3. Reviews Posted — from member_ratings
        $reviewsQuery = $this->ratingModel->where('user_id', $userId);
        $reviews_posted_count = $reviewsQuery->countAllResults();

        // 4. Events Organized — from events table
        $events_organized_count = (new \App\Models\Event())->where('user_id_pic', $userId)->countAllResults();

        return $this->successOutput([
            'summary' => [
                'events_attended' => $events_attended_count,
                'facilities_rented' => $facilities_rented_count,
                'reviews_posted' => $reviews_posted_count,
                'events_organized' => $events_organized_count,
            ]
        ]);
    }

    /**
     * Get Combined Activity List (Feed)
     * Sources: user_tickets (events attended), facility_bookings (facilities rented), member_ratings (reviews)
     */
    public function activities($identifier = null)
    {
        $userId = $this->request->id;
        $isOwner = true;

        if ($identifier) {
            $user = $this->userModel->where('id', $identifier)->orWhere('username', $identifier)->first();
            if ($user) {
                $userId = $user->id;
                $show_ratings = (bool) $user->show_ratings;
                $isOwner = ($userId == $this->request->id);
            } else {
                return $this->failNotFound('User not found');
            }
        } else {
            $user = $this->userModel->find($userId);
            $show_ratings = true; // owner always sees their own ratings
        }

        $page = (int) ($this->request->getVar('page') ?? 1);
        $per_page = (int) ($this->request->getVar('per_page') ?? 10);
        $offset = ($page - 1) * $per_page;

        $activities = [];

        // 1. Events Attended — from user_tickets
        $tickets = (new \App\Models\UserTicket())
            ->select('user_tickets.*, event_ticket.event_id, events.title as event_title, events.thumbnail_url, events.start_date as event_date')
            ->join('event_ticket', 'event_ticket.id = user_tickets.event_ticket_id', 'left')
            ->join('events', 'events.id = event_ticket.event_id', 'left')
            ->where('user_tickets.user_id', $userId)
            ->orderBy('user_tickets.created_at', 'DESC')
            ->findAll();

        foreach ($tickets as $ticket) {
            $activities[] = [
                'activity_type' => 'EVENT_ATTENDED',
                'data' => [
                    'ticket_id' => $ticket->id,
                    'ticket_code' => $ticket->ticket_code,
                    'status' => $ticket->status,
                    'check_in_at' => $ticket->check_in_at ?? null,
                    'event_id' => $ticket->event_id ?? null,
                    'event_title' => $ticket->event_title ?? null,
                    'event_date' => $ticket->event_date ?? null,
                    'thumbnail' => $ticket->thumbnail_url ? 'events/' . $ticket->thumbnail_url : null,
                ],
                'created_at' => $ticket->created_at,
            ];
        }

        // 2. Facilities Rented — from facility_bookings
        $bookings = (new \App\Models\FacilityBooking())
            ->select('facility_bookings.*, facilities.name as facility_name')
            ->join('facilities', 'facilities.id = facility_bookings.facility_id', 'left')
            ->where('facility_bookings.user_id', $userId)
            ->orderBy('facility_bookings.created_at', 'DESC')
            ->findAll();

        foreach ($bookings as $booking) {
            $activities[] = [
                'activity_type' => 'FACILITY_RENTED',
                'data' => [
                    'booking_id' => $booking->id,
                    'facility_code' => $booking->facility_code,
                    'facility_name' => $booking->facility_name ?? null,
                    'booking_date' => $booking->booking_date,
                    'start_time' => $booking->start_time,
                    'end_time' => $booking->end_time,
                    'total_price' => $booking->total_price,
                    'status' => $booking->status,
                ],
                'created_at' => $booking->created_at,
            ];
        }

        // 3. Reviews Posted — from member_ratings (respects show_ratings & is_public for public viewers)
        if ($show_ratings) {
            $ratingQuery = $this->ratingModel->where('user_id', $userId);
            if (!$isOwner) {
                $ratingQuery->where('is_public', 1);
            }
            $ratings = $ratingQuery->orderBy('created_at', 'DESC')->findAll();

            foreach ($ratings as $rating) {
                $target_details = null;
                if ($rating->target_type === 'EVENT') {
                    $event = (new \App\Models\Event())->find($rating->target_id);
                    $target_details = $event ? [
                        'title' => $event->title,
                        'thumbnail' => $event->thumbnail_url ? 'events/' . $event->thumbnail_url : null,
                    ] : null;
                } elseif ($rating->target_type === 'FACILITY') {
                    $fac = (new Facilitie())->find($rating->target_id);
                    $target_details = $fac ? ['name' => $fac->name] : null;
                }

                $activities[] = [
                    'activity_type' => 'REVIEW_POSTED',
                    'data' => [
                        'rating_id' => $rating->id,
                        'target_type' => $rating->target_type,
                        'target_id' => $rating->target_id,
                        'rating' => $rating->rating,
                        'comment' => $rating->comment,
                        'is_public' => $rating->is_public,
                        'target_details' => $target_details,
                    ],
                    'created_at' => $rating->created_at,
                ];
            }
        }

        // Sort all by created_at descending (latest first)
        usort($activities, function ($a, $b) {
            return strtotime($b['created_at']) <=> strtotime($a['created_at']);
        });

        // Manual pagination
        $total = count($activities);
        $total_page = (int) ceil($total / $per_page);
        $activities = array_slice($activities, $offset, $per_page);

        return $this->successOutput([
            'activities' => $activities,
            'total' => $total,
            'total_page' => $total_page,
            'page' => $page,
            'per_page' => $per_page,
        ]);
    }

    // ─── Notifications ────────────────────────────────────────────────────────

    /**
     * GET  profile/notifications
     * Query params: page, per_page, type (optional), unread_only (1|0)
     */
    public function notifications()
    {
        $userId = $this->request->id;
        if (!$userId) {
            return $this->failUnauthorized();
        }



        $searchable_column = [
            'search' => [
                'user_id',
                'type',
                'entity_type',
                'entity_id',
                'title',
                'message',
                'metadata',
                'is_read',
            ],
        ];


        $where = [
            'user_id' => $userId,
            'type' => 'new_follower',
            'is_read' => 0
        ];
        // Execute search filter
        $output = SearchFilter::execute($this->notificationModel, $searchable_column, 'notifications', $where);
        array_walk($output['notifications'], function (&$item) {
            $follower = $this->userModel->find($item->entity_id);
            $item->follower = $follower ? [
                'id' => $follower->id,
                'name' => $follower->name,
                'username' => $follower->username,
                'profile_picture' => $follower->profile_picture
            ] : null;
            $item->link_url = '/member/' . $follower->username;
        });

        return $this->successOutput($output);


    }

    /**
     * POST  profile/notifications/read
     * Body (JSON): { id: <int|null> }  — omit id to mark ALL as read
     */
    public function readNotification()
    {
        $userId = $this->request->id;
        if (!$userId) {
            return $this->failUnauthorized();
        }

        $id = $this->request->getJsonVar('notificationId');

        if ($id) {
            $notif = $this->notificationModel->find($id);
            if (!$notif || $notif->user_id != $userId) {
                return $this->failNotFound('Notification not found');
            }
            $this->notificationModel->update($id, ['is_read' => 1]);
            return $this->successOutput(['message' => 'Notification marked as read']);
        }

        // Mark ALL as read
        $this->notificationModel
            ->where('user_id', $userId)
            ->where('is_read', 0)
            ->set(['is_read' => 1])
            ->update();

        return $this->successOutput(['message' => 'All notifications marked as read']);
    }



    // ─── Members ──────────────────────────────────────────────────────────────

    public function members()
    {
        $Model = new User();

        // Define searchable column on this model
        $searchable_column = [
            'search' => [
                'username',
                'name',
                'email',
            ],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'members', []);

        array_walk($output['members'], function (&$item) {
            // Followers & Following count
            $item->followers_count = $this->followModel->where(['following_id' => $item->id, 'following_type' => 'MEMBER'])->countAllResults();
            $item->following_count = $this->followModel->where(['follower_id' => $item->id])->countAllResults();

            $SysUserRole = new SysUsersRole();
            $item->scope = $SysUserRole->select('scope')->where('role_name', $item->role)->first()->scope ?? 'GUEST';



        });



        // Return output
        return $this->successOutput($output);
    }
}
