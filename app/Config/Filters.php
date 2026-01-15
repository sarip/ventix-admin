<?php

namespace Config;

use App\Filters\ApiLogFilter;
use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\Honeypot;
use CodeIgniter\Filters\InvalidChars;
use CodeIgniter\Filters\SecureHeaders;

class Filters extends BaseConfig
{
    /**
     * Configures aliases for Filter classes to
     * make reading things nicer and simpler.
     *
     * @var array
     */
    public $aliases = [
//        'csrf'          => CSRF::class,
        'toolbar'       => DebugToolbar::class, // stupid memory hogger !
        'honeypot'      => Honeypot::class,
        'invalidchars'  => InvalidChars::class,
        'secureheaders' => SecureHeaders::class,
        'authFilter' => \App\Filters\AuthFilter::class,
        'adminFilter' => [\App\Filters\AdminFilter::class],
        'superAdminFilter' => [\App\Filters\SuperAdminFilter::class],
        'operatorFilter' => [\App\Filters\OperatorFilter::class],
        'tokenFilter' => [\App\Filters\TokenFilter::class, ApiLogFilter::class],
        'OptionFilter' => \App\Filters\OptionFilter::class,
        'PermissionFilter' => [\App\Filters\AuthFilter::class, \App\Filters\PermissionFilter::class, ApiLogFilter::class]
    ];

    /**
     * List of filter aliases that are always
     * applied before and after every request.
     *
     * @var array
     */
    public $globals = [
        'before' => [
        'OptionFilter'
//         'cors' => ['before' => ['api/*']],
//             'cors' => ['except' => ['api/*']],
            // 'honeypot',
            // 'csrf',
            // 'invalidchars',
        ],
        'after' => [
//             'cors',
//             'cors' => ['except' => ['api/*']],
             'toolbar',
            // 'honeypot',
            // 'secureheaders',
        ],
    ];

    /**
     * List of filter aliases that works on a
     * particular HTTP method (GET, POST, etc.).
     *
     * Example:
     * 'post' => ['foo', 'bar']
     *
     * If you use this, you should disable auto-routing because auto-routing
     * permits any HTTP method to access a controller. Accessing the controller
     * with a method you don’t expect could bypass the filter.
     *
     * @var array
     */
    public $methods = [];

    /**
     * List of filter aliases that should run on any
     * before or after URI patterns.
     *
     * Example:
     * 'isLoggedIn' => ['before' => ['account/*', 'profiles/*']]
     *
     * @var array
     */
    public $filters = [

//         'options' => [
//             'before' => ['api/*']
//         ],
    ];
}
