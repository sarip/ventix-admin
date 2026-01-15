<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Validation\StrictRules\CreditCardRules;
use CodeIgniter\Validation\StrictRules\FileRules;
use CodeIgniter\Validation\StrictRules\FormatRules;
use CodeIgniter\Validation\StrictRules\Rules;

class Validation extends BaseConfig
{
    // --------------------------------------------------------------------
    // Setup
    // --------------------------------------------------------------------

    /**
     * Stores the classes that contain the
     * rules that are available.
     *
     * @var list<string>
     */
    public array $ruleSets = [
        Rules::class,
        FormatRules::class,
        FileRules::class,
        CreditCardRules::class,
    ];

    /**
     * Specifies the views that are used to display the
     * errors.
     *
     * @var array<string, string>
     */
    public array $templates = [
        'list'   => 'CodeIgniter\Validation\Views\list',
        'single' => 'CodeIgniter\Validation\Views\single',
    ];

    // --------------------------------------------------------------------
    // Rules
    // --------------------------------------------------------------------

    /**
     * Custom validation messages
     *
     * @var array<string, array<string, string>>
     */
    public array $errors = [
        'required'    => ' {field} kudu di isi.',
        'min_length'  => 'The {field} field must be at least {param} characters long.',
        'max_length'  => 'The {field} field cannot exceed {param} characters.',
        'is_unique'   => 'The {field} already exists. Please choose a different {field}.',
        'valid_email' => 'The {field} field must contain a valid email address.',
        'valid_url'   => 'The {field} field must contain a valid URL.',
        // Add more custom messages as needed
    ];
}
