<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\SysUserpointCat;

class SysUserpointCatController extends ApiController
{

    /**
     * List SysUserpointCat Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/sys_userpoint_cat List SysUserpointCat
     * @apiName List-SysUserpointCat
     * @apiGroup SysUserpointCat
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of SysUserpointCat
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new SysUserpointCat();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'sys_userpoint_cat', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create SysUserpointCat
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/sysuserpointcat Create SysUserpointCat
     * @apiName Create-SysUserpointCat
     * @apiGroup SysUserpointCat
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function create() {
        $SysUserpointCat = new SysUserpointCat();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];

        $name = $SysUserpointCat->insert($create_data);

        return $this->successOutput(['name' => $name], 201);
    }


    /**
     * Update SysUserpointCat
     * @param $name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/sysuserpointcat/:name Update SysUserpointCat
     * @apiName Update-SysUserpointCat
     * @apiGroup SysUserpointCat
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name SysUserpointCat name
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function update($id) {
        $SysUserpointCat = new SysUserpointCat();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];

        $SysUserpointCat->update($name, $update_data);

        $data = $SysUserpointCat->find($name);

        return $this->successOutput(['sysuserpointcat' => $data]);
    }


    /**
     * Delete SysUserpointCat
     *
     * @param $name
     * @return mixed
     *
     * @api {delete} /api/v1/sysuserpointcat/:name Delete SysUserpointCat
     * @apiName Delete-SysUserpointCat
     * @apiGroup SysUserpointCat
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name SysUserpointCat name
     */
    public function delete($name) {
        $SysUserpointCat = new SysUserpointCat();
        $SysUserpointCat->delete($name);

        return $this->successOutput([], 200);
    }
}
