<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class FixModelPrimaryKey extends BaseCommand
{
    protected $group       = 'Maintenance';
    protected $name        = 'fix:pk-models';
    protected $description = 'Automatically update Model $primaryKey fields to `id`.';

    public function run(array $params)
    {
        $modelPath = APPPATH . "Models/";
        $files = $this->getPhpFiles($modelPath);

        $log = WRITEPATH . "logs/model_pk_fix_" . date("Ymd_His") . ".log";
        file_put_contents($log, "=== MODEL PRIMARY KEY FIX START ===\n\n");

        foreach ($files as $file) {
            $content = file_get_contents($file);

            // Replace str_contains() -> strpos() !== false
            if (strpos($content, 'protected $primaryKey') === false) {
                file_put_contents($log, "[SKIP] " . basename($file) . " → No primaryKey defined\n", FILE_APPEND);
                continue;
            }

            // Cari nilai primaryKey
            preg_match('/protected\s+\$primaryKey\s*=\s*[\'"](.+?)[\'"]\s*;/', $content, $matches);

            if (!isset($matches[1])) {
                file_put_contents($log, "[SKIP] " . basename($file) . " → Pattern not found\n", FILE_APPEND);
                continue;
            }

            $current = $matches[1];

            if ($current === 'id') {
                file_put_contents($log, "[SKIP] " . basename($file) . " → Already id\n", FILE_APPEND);
                continue;
            }

            // Replace string
            $newContent = preg_replace(
                '/protected\s+\$primaryKey\s*=\s*[\'"](.+?)[\'"]\s*;/',
                "protected \$primaryKey = 'id';",
                $content
            );

            file_put_contents($file, $newContent);

            file_put_contents(
                $log,
                "[UPDATED] " . basename($file) . " → `$current` → `id`\n",
                FILE_APPEND
            );

            CLI::write("Updated: " . basename($file), "green");
        }

        file_put_contents($log, "\n=== PROCESS COMPLETE ===", FILE_APPEND);

        CLI::write("\nDone. Log: " . basename($log), "yellow");
    }

    private function getPhpFiles($dir)
    {
        $rii = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir));
        $files = [];

        foreach ($rii as $file) {
            if (!$file->isDir() && pathinfo($file->getPathname(), PATHINFO_EXTENSION) === 'php') {
                $files[] = $file->getPathname();
            }
        }

        return $files;
    }
}
