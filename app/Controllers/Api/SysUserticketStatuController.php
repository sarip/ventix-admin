<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\SysUserticketStatu;

class SysUserticketStatuController extends ApiController
{

    /**
     * List SysUserticketStatu Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/sys_userticket_status List SysUserticketStatu
     * @apiName List-SysUserticketStatu
     * @apiGroup SysUserticketStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of SysUserticketStatu
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new SysUserticketStatu();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'sys_userticket_status', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create SysUserticketStatu
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/sysuserticketstatu Create SysUserticketStatu
     * @apiName Create-SysUserticketStatu
     * @apiGroup SysUserticketStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} display_name display_name
     * @apiBody {String} description description
     * @apiBody {String} color_code color_code

     *
     */
    public function create() {
        $SysUserticketStatu = new SysUserticketStatu();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'display_name' => $this->request->getJsonVar('display_name'),
            'description' => $this->request->getJsonVar('description'),
            'color_code' => $this->request->getJsonVar('color_code')
        ];

        $name = $SysUserticketStatu->insert($create_data);

        return $this->successOutput(['name' => $name], 201);
    }


    /**
     * Update SysUserticketStatu
     * @param $name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/sysuserticketstatu/:name Update SysUserticketStatu
     * @apiName Update-SysUserticketStatu
     * @apiGroup SysUserticketStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name SysUserticketStatu name
     * @apiBody {String} name name
     * @apiBody {String} display_name display_name
     * @apiBody {String} description description
     * @apiBody {String} color_code color_code

     *
     */
    public function update($id) {
        $SysUserticketStatu = new SysUserticketStatu();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'display_name' => $this->request->getJsonVar('display_name'),
            'description' => $this->request->getJsonVar('description'),
            'color_code' => $this->request->getJsonVar('color_code')
        ];

        $SysUserticketStatu->update($name, $update_data);

        $data = $SysUserticketStatu->find($name);

        return $this->successOutput(['sysuserticketstatu' => $data]);
    }


    /**
     * Delete SysUserticketStatu
     *
     * @param $name
     * @return mixed
     *
     * @api {delete} /api/v1/sysuserticketstatu/:name Delete SysUserticketStatu
     * @apiName Delete-SysUserticketStatu
     * @apiGroup SysUserticketStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name SysUserticketStatu name
     */
    public function delete($name) {
        $SysUserticketStatu = new SysUserticketStatu();
        $SysUserticketStatu->delete($name);

        return $this->successOutput([], 200);
    }
}
