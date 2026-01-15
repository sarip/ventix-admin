import React, {useState} from "react";




interface RoleProps {
    role_action?: any
}

const ActivityPage: React.FC<RoleProps> = (role_action ) => {
    return (
        <div className="card">
            <h5 className="card-header">Permission</h5>
            <div className="card-body">

            </div>
            <div className="table-responsive">
                <table className="table table-striped table-borderless">
                    <thead>
                    <tr>
                        <th className="text-nowrap">Role</th>
                        <th className="text-nowrap text-center">Read</th>
                        <th className="text-nowrap text-center">Create</th>
                        <th className="text-nowrap text-center">Update</th>
                        <th className="text-nowrap text-center">Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {role_action.role_action.length > 0 ? (

                        role_action.role_action.map((role, key) => (
                            <tr key={key}>
                                <td className="text-nowrap">{role.label}</td>
                                <td>
                                    <div className="form-check d-flex justify-content-center">
                                        <input className="form-check-input" type="checkbox" id="defaultCheck1"
                                               checked={role.can_read === 'Y'} readOnly/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-check d-flex justify-content-center">
                                        <input className="form-check-input" type="checkbox" id="defaultCheck1"
                                               checked={role.can_create === 'Y'} readOnly/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-check d-flex justify-content-center">
                                        <input className="form-check-input" type="checkbox" id="defaultCheck1"
                                               checked={role.can_update === 'Y'} readOnly/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-check d-flex justify-content-center">
                                        <input className="form-check-input" type="checkbox" id="defaultCheck1"
                                               checked={role.can_delete === 'Y'} readOnly/>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                            <div className="alert alert-solid-info" role="alert">
                                <span>Role tidak ditemukan</span>
                            </div>

                            </td>
                        </tr>
                    )}

                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default ActivityPage;